import type { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { postActivityTable, postsTable } from "../database/database.tables";

export const InsertPostActivitySchema = createInsertSchema(postActivityTable);
export const SelectPostActivitySchema = createSelectSchema(postActivityTable);

export type InsertPostActivitySchema = z.infer<typeof InsertPostActivitySchema>;
export type SelectPostActivitySchema = z.infer<typeof SelectPostActivitySchema>;

export const InsertPostSchema = createInsertSchema(postsTable);
export const SelectPostSchema = createSelectSchema(postsTable);

export type InsertPostSchema = z.infer<typeof InsertPostSchema>;
export type SelectPostSchema = z.infer<typeof SelectPostSchema>;
