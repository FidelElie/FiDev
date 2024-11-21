/** Default config generateRandomString function */
const DEFAULT_CONFIG: NonNullable<Config> = {
	numerals: true,
	symbols: false,
	lowercase: false,
};

/**
 * Generate random string of characters
 * @param number length of the desired string - default is 6
 * @param config include numerals or symbols - numerals included by default
 * @returns generated string
 */
export const generateRandomString = (number = 6, config?: Config) => {
	const options = Object.assign(DEFAULT_CONFIG, config || {});

	const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
	const numerals = "0123456789";
	const symbols = "?<>:=+*|{}[]()!@£$%^";
	const lowercase = chars.toLowerCase();

	const inclusions = [
		...chars.split(""),
		...(options.numerals ? [numerals] : []),
		...(options.symbols ? [symbols] : []),
		...(options.lowercase ? [lowercase] : []),
	]
		.join("")
		.split("");

	const generatedString = new Array(number).fill(null).map(() => {
		return inclusions[Math.ceil(Math.random() * (inclusions.length - 1))];
	});

	return generatedString.join("");
};

type Config = { numerals?: boolean; symbols?: boolean; lowercase?: boolean };
