import { visit } from "unist-util-visit";
import { fromHtml } from "hast-util-from-html";
import type { Root, Element } from "hast";

import { toRegexCompliantString, type PromiseOrNot } from "@fi.dev/typescript";
import { writeFileSync } from "fs";

type RegExpDirective<T> = {
	identifier: RegExp | string;
	onMatch: (match: RegExpMatchArray) => PromiseOrNot<T>;
	getHTML: (matchResult: NoInfer<T>) => PromiseOrNot<string | undefined | null>;
};

/**
 *
 * @param htmlString
 * @returns
 */
const HTMLToHast = async (htmlString: string) => {
	return fromHtml(htmlString, { fragment: true }).children[0] as Element;
};

/**
 * Helper to create regexp directive transformer to register with plugin
 * @param directive
 * @returns
 */
export const createRegExpDirective = <T,>(directive: RegExpDirective<T>) => {
	const { identifier } = directive;

	if (typeof identifier !== "string" && !(identifier instanceof RegExp)) {
		throw new Error("Directive identifier must be of type string or RegExp");
	}

	return directive;
};

/**
 *
 * @param directives
 * @returns
 */
export const remarkRegExpDirective = (
	directives: RegExpDirective<unknown>[],
) => {
	const standardisedDirectives = directives.map((directive) => {
		const { identifier } = directive;

		return {
			...directive,
			identifier:
				typeof identifier === "string" ? new RegExp(identifier) : identifier,
		};
	});

	return async function transformer(tree: Root) {
		tree.children;

		const textNodes: Element[] = [];

		visit(tree, "element", function (node) {
			if (node.tagName === "p") {
				textNodes.push(node);
			}
		});

		await Promise.all(
			textNodes.map(async (node) => {
				const { children } = node;

				const mappedChildren = await Promise.all(
					children.map(async (child) => {
						if (child.type !== "text") {
							return [child];
						}

						const directiveMatches = await Promise.all(
							standardisedDirectives.map(async (directive) => {
								const matches = Array.from(
									child.value.matchAll(directive.identifier),
								);

								return Promise.all(
									matches.map(async (match) => {
										const html = await directive.getHTML(
											await directive.onMatch(match),
										);

										if (!html) {
											return [];
										}

										const ast = await HTMLToHast(html.trim());

										return {
											directive: match[0],
											index: match.index,
											ast: {
												...ast,
												position: undefined,
											},
										};
									}),
								);
							}),
						);

						const flattened = directiveMatches.flat().flat();

						if (!flattened.length) {
							return [child];
						}

						const flattenedMatches = flattened.toSorted(
							(matchA, matchB) => matchA.index - matchB.index,
						);

						const uniqueIdentifiers = Array.from(
							new Set(
								flattenedMatches.map((match) =>
									toRegexCompliantString(match.directive),
								),
							),
						);

						const splitRegexp = new RegExp(`${uniqueIdentifiers.join("|")}`);

						const split = child.value.split(splitRegexp);

						const reformedAST = split.reduce(
							(tree, string, treeIndex) => {
								if (string) {
									tree.push({ type: "text", value: string });
								}

								const directive = flattenedMatches[treeIndex];

								if (!directive) {
									return tree;
								}

								tree.push(directive.ast);

								return tree;
							},
							[] as typeof children,
						);

						return reformedAST;
					}),
				);

				node.children = mappedChildren.flat();
			}),
		);

		return tree;
	};
};
