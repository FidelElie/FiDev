import type { z, ZodSchema } from "zod";

export type InferDTOS<T extends { [key: string | number]: ZodSchema }> = {
	[key in keyof T]: z.infer<T[keyof T]>;
};
