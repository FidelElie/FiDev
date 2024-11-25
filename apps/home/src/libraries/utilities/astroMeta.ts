export const astroMeta = (config: AstroMetaConfig) => {
	// TODO add check for description length and title

	return config;
};

type AstroMetaConfig = {
	title: string;
	description: string;
};
