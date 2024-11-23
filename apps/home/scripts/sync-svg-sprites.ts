import fs from "node:fs";
import path from "node:path";

const BASE_PATH = process.cwd();

const syncSVGSprites = () => {
	const spritesPath = path.join(BASE_PATH, "src/components/astro/InlineSprites.astro");

	const outputPath = path.join(BASE_PATH, "src/components/core/display/Icon.data.ts");

	const idExtractionRegex = /<symbol[^>]*\sid="(icon-sprite-[^"]+)"/gi;

	const fileContents = fs.readFileSync(spritesPath).toString();

	const iconIds = Array.from(
		fileContents.matchAll(idExtractionRegex),
		match => match[1].replace("icon-sprite-", "")
	);

	const outputFileContents = [
		"/** Autogenerated by scripts/sync-svg-sprites.ts do not - modify manually */",
		"",
		"/** Supported icon sprites for component */",
		"export const ICONS_SPRITES = [",
		...iconIds.map(id => `\t"${id}",`),
		"] as const;"
	].join("\n");

	fs.writeFileSync(outputPath, outputFileContents);

	console.log(`SVG sprites have been synced successfully to ${outputPath}`);
}

syncSVGSprites();
