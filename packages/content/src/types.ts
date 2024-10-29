import type { ArrayOrNot, PromiseOrNot } from "@fi.dev/typescript";

export type ContentConfig = {
	/**
	* Enable more verbose logging
	*/
	debug?: boolean;
	/**
	* Where your posts will be created/edited - defaults to /posts
	*/
	dir?: string;
	/**
	* Register post entry flows
	*/
	entries: ContentPostEntry<any>[];
	/**
	 *
	 */
	hooks?: ContentHook[];
	/**
	 * Define which markdown type you want to output to
	 */
	type?: "md" | "mdx" | "markdoc";
	/**
	 * Handle post publishing
	 */
	onPublish?: PostPublishContext<any>;
}

export type ContentPostEntry<T> = {
	/**
	* Identifier slug for where posts will be saved
	*/
	id: string;
	/**
	* Give entry a more human friendly name
	*/
	name?: string;
	/**
	* Define extra path segments when creating new posts
	*/
	path?: string | (() => PromiseOrNot<string>);
	/**
	* Optional validator for post information
	*/
	validator?: (input: unknown) => PromiseOrNot<T>;
	/**
	* Define flow for creating a new post - will revert to default process if not found
	*/
	onCreate?: PostCreationContext<T>;
	/**
	* Define flow for editing an existing post
	*/
	onEdit?: PostEditContext<T>;
}

type PostContext<T> = { entry: ContentPostEntry<T>; }

type ContentHook = {
	events: ("create" | "edit" | "delete")[];
	onEvent: (entries: { post: any; path: string; }[]) => PromiseOrNot<void>;
}

export type PostCreationContext<T> = (context: PostContext<T>) => PromiseOrNot<
	ArrayOrNot<{ slug: string; path?: string; metadata: T }>
>;

export type PostEditContext<T> = (
	context: PostContext<T>
) => PromiseOrNot<
	{ path?: string; metadata: T; }
>;

export type PostPublishContext<T> = (
	context: { entries: PublishPostEntry<T>[]; action: "publish" | "unpublish" }
) => PromiseOrNot<void>;

export type PublishPostEntry<T> = { post: ContentPostEntry<T>; date: Date };
