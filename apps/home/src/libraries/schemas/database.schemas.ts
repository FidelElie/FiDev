import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { MusicPostMetadata } from "./music.schemas";
import { getConstKeys } from "@fi.dev/typescript";

export const postsTable = pgTable(
	"posts_table",
	{
		id: text("slug").notNull().primaryKey(),
		views: integer("views").default(0),
		liked: integer("liked").default(0),
		ratings: integer("ratings").default(0),
		publishedAt: timestamp("published_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date())
	}
);

export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;

export const ratingEnum = pgEnum("rating", getConstKeys(MusicPostMetadata.ratings));

export const postActivityTable = pgTable(
	"post_activity_table",
	{
		id: serial("id").primaryKey(),
		postId: text("post_id").notNull().references(() => postsTable.id, { onDelete: "cascade" }),
		anonymousId: text("anonymous_id"),
		liked: boolean("liked").default(false),
		rating: ratingEnum(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	}
);

export type InsertPostActivity = typeof postActivityTable.$inferInsert;
export type SelectPostActivity = typeof postActivityTable.$inferSelect;
