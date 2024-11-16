import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { getConstKeys } from "@fi.dev/typescript";

import { MusicPostMetadata } from "../constants";

export const postsTable = pgTable(
	"posts_table",
	{
		id: text("slug").notNull().primaryKey(),
		views: integer("views").default(0),
		liked: integer("liked").default(0),
		ratings: integer("ratings").default(0),
		publishedAt: timestamp("published_at").defaultNow(),
		updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	}
);

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
