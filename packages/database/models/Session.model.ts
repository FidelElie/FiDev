import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import * as uuid from "uuid";

import { UserModel } from "./User.model";

export const SessionModel = pgTable("sessions", {
	id: text("id").primaryKey().$defaultFn(() => uuid.v7()),
	userId: text("user_id").notNull().references(() => UserModel.id, { onDelete: "cascade" }),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
