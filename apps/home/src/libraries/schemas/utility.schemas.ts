import { z, type ZodSchema } from "zod";

export const paginateSchema = <T extends ZodSchema>(schema: T) => {
	return z.object({
		items: z.array(schema),
		pagination: z.object({
			page: z.number(),
			size: z.number(),
			next: z.boolean(),
			previous: z.boolean(),
		})
	})
}

export const arrayQueryParam = () => {
	return z.union(
		[z.array(z.string()), z.string()]
	).transform(input => Array.isArray(input) ? input : [input]);
}
