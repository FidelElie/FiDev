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
		internal: {
			SITEMAP: "/sitemap-index.xml",
		},
		socials: {
			GITHUB: "https://github.com/FidelElie",
			SPOTIFY: "spotify:user:1147375969",
			LINKEDIN: "https://www.linkedin.com/in/fidel-elie/",
			INSTAGRAM: "https://www.instagram.com/fidelpe",
			EMAIL: "fidel.elie@gmail.com",
		},
		external: {
			"apple-music:search": (term: string) =>
				`https://music.apple.com/us/search?term=${encodeURIComponent(term)}`,
			"soundcloud:search": (q: string) =>
				`https://soundcloud.com/search?q=${encodeURIComponent(q)}`,
			"spotify:directive": (
				type: "artist" | "playlist" | "track" | "album" | "user",
				id: string,
			) => `spotify:${type}:${id}`,
		},
	},
} as const;
