import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, sql } from "drizzle-orm";

import { getEnvironmentVariable } from "@fi.dev/typescript";

import { postActivityTable, postsTable } from "./database.tables";
import type { InsertPostSchema, InsertPostActivitySchema } from "../schemas";
import type { MusicPostRatingMap } from "../constants";

const connection = neon(getEnvironmentVariable("NEON_DATABASE_URL"));

const db = drizzle(connection);

export const client = {
	db,
	post: {
		createPost: async (data: InsertPostSchema) => {
			return db.insert(postsTable).values(data);
		},
		createPosts: async (data: InsertPostSchema[]) => {
			return db.insert(postsTable).values(data);
		},
		getPostBySlugId: async (slugId: string) => {
			return db.select().from(postsTable).where(eq(postsTable.id, slugId));
		},
		handleLikingPost: async (context: {
			slugId: string;
			ipAddress: string;
		}) => {
			const { slugId, ipAddress } = context;

			const hashedIp = ipAddress;

			await Promise.all([
				db
					.update(postsTable)
					.set({ liked: sql`${postsTable.liked} + 1` })
					.where(eq(postsTable.id, slugId)),
				db
					.insert(postActivityTable)
					.values({
						postId: slugId,
						anonymousId: hashedIp,
						liked: true,
					})
					.onConflictDoUpdate({
						target: [postActivityTable.anonymousId, postActivityTable.postId],
						set: {
							liked: true,
						},
					}),
			]);
		},
		handleRatingMusicPost: async (context: {
			slugId: string;
			ipAddress: string;
			rating: keyof typeof MusicPostRatingMap;
		}) => {
			const { slugId, ipAddress, rating } = context;

			const hashedIp = ipAddress;

			await Promise.all([
				db
					.update(postsTable)
					.set({ ratings: sql`${postsTable.ratings} + 1` })
					.where(eq(postsTable.id, slugId)),
				db
					.insert(postActivityTable)
					.values({
						postId: slugId,
						anonymousId: hashedIp,
						rating,
					})
					.onConflictDoUpdate({
						target: [postActivityTable.anonymousId, postActivityTable.postId],
						set: {
							rating,
						},
					}),
			]);
		},
		handlePostPublishing: async (
			entries: { slug: string; publishDate?: Date }[],
		) => {
			for (const entry of entries) {
				const publishedAt = entry.publishDate || new Date();

				await db
					.insert(postsTable)
					.values({ publishedAt, id: entry.slug })
					.onConflictDoUpdate({
						target: [postsTable.id],
						set: { publishedAt },
					});
			}
		},
		deletePostEntryById: async (postSlug: string) => {
			return db.delete(postsTable).where(eq(postsTable.id, postSlug));
		},
	},
	postActivity: {
		createPostActivity: async (data: InsertPostActivitySchema) => {
			const { postId } = data;

			await db.insert(postActivityTable).values(data);
			await db
				.update(postsTable)
				.set({ views: sql`${postsTable.views} + 1` })
				.where(eq(postsTable.id, postId));
		},
	},
};
