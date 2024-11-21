declare global {
	/** Declare shared interface that can be used to define variables for both systems */
	export namespace FiDev {
		interface EnvironmentVariables extends ImportMetaEnv, NodeJS.ProcessEnv {
			NODE_ENV: "development" | "production" | "test";
		}
	}
}

export {};
