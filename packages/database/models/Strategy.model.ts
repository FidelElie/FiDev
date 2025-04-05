import { json, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { UserModel } from "./User.model";

type StrategyConfig =
	| { type: "password"; password: string }
	| { type: "email"; token: string };

export const StrategyModel = pgTable(
	"strategies",
	{
		id: serial().primaryKey(),
		userId: text("user_id").notNull().references(() => UserModel.id, { onDelete: "cascade" }),
		config: json().$type<StrategyConfig>().notNull(),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at"),
	},
);
