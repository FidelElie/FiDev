import fs from "fs";
import path from "path";

import chalk from "chalk";
import { Command } from "commander";
import glob from "fast-glob";

const ROOT = path.resolve(__dirname, "../");
const ROOT_ENV_PATH = path.join(ROOT, ".env");

const ensureRootFileExists = () => {
	if (!fs.existsSync(ROOT_ENV_PATH)) {
		console.error(chalk.red("Cannot populate template as env file missing"));
		process.exit(1);
	}
};

const getTemplatePaths = () =>
	glob.sync(
		["**/.env.template"],
		{ ignore: ["**/node_modules"], cwd: ROOT },
	).map(globPath => path.join(ROOT, globPath));

const parseEnvEntriesFromFile = (path: string) => {
	const templateContents = fs.readFileSync(path).toString();

	const parsedLines = templateContents.split("\n").filter(
		line => line && !line.startsWith("#"),
	);

	const variables = parsedLines.map(line => {
		const [variable, ...valueArray] = line.split("=");

		const parsedValue = valueArray.length ? valueArray.join("=") : "";

		return [variable, parsedValue || null] as const;
	});

	return variables;
};

const parseEntriesToFile = (
	entries: [string, string | null][] | Map<string, string | null>,
) => {
	return Array.from(entries, ([variable, value]) => `${variable}=${value || ""}`).join("\n");
};

/** Add environment variables to one root file for repo wide population */
const initialiseRootEnvFile = () => {
	if (fs.existsSync(ROOT_ENV_PATH)) {
		console.error(chalk.red("Root env file already exists - not overwriting"));
		return;
	}

	const templatePaths = getTemplatePaths();

	console.log(chalk.blue("Template paths found at following paths:"));
	for (const path of templatePaths) { console.log(chalk.gray(path)); }

	const envTemplateVariables = templatePaths.flatMap(parseEnvEntriesFromFile);

	const uniqueVariables = new Map(envTemplateVariables);

	if (!uniqueVariables.size) {
		console.warn(chalk.yellow(
			"\nCouldn't find any environment variables to write - skipping creation",
		));

		return;
	}

	console.log(`\nEnvironment variables to add: ${uniqueVariables.size} - writing to file`);

	const rootEnvFileContents = Array.from(uniqueVariables).flatMap(([variable, value]) => [
		...(value ? ["# OPTIONAL"] : []),
		`${variable}=`,
	]).join("\n");

	fs.writeFileSync(ROOT_ENV_PATH, rootEnvFileContents);

	console.log(chalk.green(`Environment variables added to root .env file`));
};

/** Populate all repository environment variable files */
export const populateEnvironmentFiles = () => {
	ensureRootFileExists();

	const rootEnvMap = Object.fromEntries(parseEnvEntriesFromFile(ROOT_ENV_PATH));

	const templatePaths = getTemplatePaths();

	for (const templatePath of templatePaths) {
		const directory = path.dirname(templatePath);

		const isCloudflare = !!glob.sync([`${directory}/(wrangler.jsonc|wrangler.json|wrangler.yaml)`])
			.length;

		const fileName = isCloudflare ? ".dev.vars" : ".env";
		const cloudflareSuffix = isCloudflare ? `[${chalk.yellow("CLOUDFLARE")}]` : "";

		console.log(
			`Creating ${chalk.blue(fileName)} for path ${templatePath} ${cloudflareSuffix}`.trim(),
		);

		const modifiedTemplateContents = parseEnvEntriesFromFile(templatePath).map(
			([variable, value]) => [variable, rootEnvMap[variable] || value] as const,
		);

		fs.writeFileSync(
			path.join(directory, fileName),
			parseEntriesToFile(new Map(modifiedTemplateContents)),
		);
	}
};

/** Sync new environment variables with root file */
export const syncTemplateFilesWithRoot = () => {
	ensureRootFileExists();

	const currentRootVariables = new Map(parseEnvEntriesFromFile(ROOT_ENV_PATH));

	const templatePaths = getTemplatePaths();

	const envTemplateVariables = templatePaths.flatMap(parseEnvEntriesFromFile);

	const newTemplateVariables = envTemplateVariables.filter(([variable]) => {
		return !currentRootVariables.has(variable);
	});

	if (!newTemplateVariables.length) {
		console.log(chalk.blue("No new variables were found to sync"));
		return;
	}

	const updatedVariables = new Map(currentRootVariables);

	for (const [variable, value] of newTemplateVariables) {
		updatedVariables.set(variable, value);
	}

	fs.writeFileSync(ROOT_ENV_PATH, parseEntriesToFile(updatedVariables));

	console.log(`New variables added: ${newTemplateVariables.length}`);
};

const program = new Command();

program.command("init").description("Create root environment file").action(initialiseRootEnvFile);

program.command("populate").description("Populate repo environment files from template").action(
	populateEnvironmentFiles,
);

program.command("sync").description("Sync new environment variables to root file").action(
	syncTemplateFilesWithRoot,
);

program.parse();
