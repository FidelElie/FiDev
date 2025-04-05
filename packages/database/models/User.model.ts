import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import * as uuid from "uuid";

export const UserModel = pgTable(
	"users",
	{
		id: text().primaryKey().$defaultFn(() => uuid.v7()),
		email: text().unique().notNull(),
		verified: boolean().default(false),
		image: text("image"),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at"),
	},
);
