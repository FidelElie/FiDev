/**
 * Helper for pulling environment variables from different environment handles
 * @param variable representation oof the environment variable
 * @returns the environment variable value or undefined
 */
export const getEnvironmentVariable = (variable: keyof FiDev.EnvironmentVariables) => {
	return import.meta.env[variable] || process.env[variable];
}
