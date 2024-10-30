import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, sql } from "drizzle-orm";

import { getEnvironmentVariable } from "@fi.dev/typescript";

import {
	postActivityTable,
	postsTable,
	type InsertPost,
	type InsertPostActivity
} from "./database.schemas";

const connection = neon(getEnvironmentVariable("NEON_DATABASE_URL"));

const db = drizzle({ client: connection });

export const client = {
	db,
	post: {
		createPost: async (data: InsertPost) => {
			return db.insert(postsTable).values(data);
		},
		getPostBySlugId: async(slugId: string) => {
			return db.select().from(postsTable).where(eq(postsTable.id, slugId))
		},
		handleLikingPost: async (context: { slugId: string; ipAddress: string }) => {
			const { slugId, ipAddress } = context;

			const hashedIp = ipAddress;

			db.transaction(async (context) => {
				await (
					context.update(postsTable)
						.set({ liked: sql`${postsTable.liked} + 1` })
						.where(eq(postsTable.id, slugId))
				);
				// Add post activity row if it doesn't already exist - it should
				await (
					context.insert(postActivityTable)
						.values({
							postId: slugId,
							anonymousId: hashedIp,
							liked: true
						})
						.onConflictDoUpdate({
							target: [
								postActivityTable.anonymousId,
								postActivityTable.postId
							],
							set: {
								liked: true
							}
						})
				)
			})
		}
	},
	postActivity: {
		createPostActivity: async (data: InsertPostActivity) => {
			db.transaction(async (context) => {
				const { postId } = data;

				await context.insert(postActivityTable).values(data);
				await (
					context.update(postsTable)
						.set({ views: sql`${postsTable.views} + 1` })
						.where(eq(postsTable.id, postId))
				);
			});
		},
	}
}
