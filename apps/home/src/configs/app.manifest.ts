export const AppManifest = {
	application: {
		name: "Fidel Elie",
		description: "The ramblings of a man when he finally finishes something",
	},
	links: {
		pages: {
			"/home": "/",
			"/search": "/search",
			"/about": "/about",
			"/music": "/music",
			"/music/:slug": (slug: string) => `/music/${slug}`,
			"/music/artists": "/music/artists",
			"/music/artists/:slug": (slug: string) => `/music/artists/${slug}`,
			"/music/genres": "/music/genres",
		},
		socials: {
			GITHUB: "https://github.com/FidelElie",
			SPOTIFY: "https://open.spotify.com/user/1147375969?si=423990a3292040b3",
			LINKEDIN: "https://www.linkedin.com/in/fidel-elie/",
			INSTAGRAM: "https://www.instagram.com/fidelpe",
			EMAIL: "fidel.elie@gmail.com",
		},
	},
} as const;
