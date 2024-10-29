import fs from "node:fs/promises";
import { existsSync } from "node:fs";

/**
 *
 * @param path
 */
export const ensureDirExists = async (path: string) => {
	if (!existsSync(path)) {
		await fs.mkdir(path, { recursive: true });
	}
}
