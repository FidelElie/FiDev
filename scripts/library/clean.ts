import fs from "fs";
import path from "path";

import { rimraf } from "rimraf";
import { Command } from "commander";

const DEFAULT_INCLUDES = {
	node: ["node_modules"],
};

export const parseProgram = (config: ProgramConfig, rootDir: string) => {
	const loadConfiguration = fs.readFileSync(path.join(rootDir, "clean.json"));

	if (!loadConfiguration) {
		throw new Error(
			"No configuration file - expected to find clean.json in root",
		);
	}

	const { include } = JSON.parse(loadConfiguration.toString());

	const mergedIncludes = { ...DEFAULT_INCLUDES, ...include };

	const folderPathsToDelete = determineFolderPaths(
		config,
		rootDir,
		mergedIncludes,
	);

	folderPathsToDelete.forEach((path) => {
		console.log(`Cleaning ${path}`);
		rimraf(path);
	});
};

const determineFolderPaths = (
	config: ProgramConfig,
	rootDir: string,
	maps: Config,
) => {
	const { all, build, cache, node } = config;

	// Defaults to cleaning node module folders
	if (!Object.keys(config).length) {
		return findFolders(rootDir, "node_modules");
	}

	return [
		all || build
			? maps.build
					?.map((reference) => findFolders(rootDir, reference))
					.flat() || []
			: [],
		all || cache
			? maps.caches
					?.map((reference) => findFolders(rootDir, reference))
					.flat() || []
			: [],
		all || node ? findFolders(rootDir, "node_modules") : [],
	].flat();
};

const findFolders = (dirPath: string, identifier: string): string[] => {
	if (!fs.lstatSync(dirPath).isDirectory()) {
		throw new Error("Valid directory path required");
	}

	const contents = fs.readdirSync(dirPath);

	const directories = contents.filter(
		(content) =>
			fs.lstatSync(path.join(dirPath, content)).isDirectory() &&
			content !== "node_modules",
	);

	const modulesPath = contents.includes(identifier)
		? [path.join(dirPath, identifier)]
		: [];

	const nodeModulesInSubDirectories = directories.map((dirName) =>
		findFolders(path.join(dirPath, dirName), identifier),
	);

	return [modulesPath, ...nodeModulesInSubDirectories].flat();
};

const program = new Command();

program
	.name("clean")
	.description("Clean different folders throughout the monorepo")
	.version("1.0.0");

program
	.option("-n, --node", "clean node module folders")
	.option("-b, --build", "clean build folders")
	.option("-c, --cache", "clean cache folders")
	.option("-a, --all", "clean all supported folder types");

program.parse();

const options = program.opts() satisfies ProgramConfig;
const rootDir = path.resolve(path.resolve(__dirname, "../.."));

parseProgram(options, rootDir);

type Config = {
	node?: string[];
	build?: string[];
	caches?: string[];
};

type ProgramConfig = {
	node?: true;
	build?: true;
	all?: true;
	cache?: true;
};
