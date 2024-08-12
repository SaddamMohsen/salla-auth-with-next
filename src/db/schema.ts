import {
	timestamp,
	pgTable,
	text,
	primaryKey,
	integer,
	uuid,
	jsonb,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { InferModel, relations } from "drizzle-orm";

export const users = pgTable("user", {
	id: text("id").notNull().primaryKey(),
	name: text("name"),
	email: text("email").unique(),
	emailVerified: timestamp("emailVerified", { mode: "date" }),
	image: text("image"),
	mobile: text("mobile").unique(),
	role: text('role'),
	created_at: timestamp("created_at", { mode: "string" }),// '2024-07-11 23:31:35',
	//username: text("username").unique(),
	merchant: jsonb("merchant"),
});

export type User = InferModel<typeof users>;

export const accounts = pgTable(
	"account",
	{
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccount["type"]>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(account) => ({
		compoundKey: primaryKey(account.provider, account.providerAccountId),
	})
);

export const sessions = pgTable("session", {
	sessionToken: text("sessionToken").notNull().primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
	"verificationToken",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { mode: "date" }).notNull(),
	},
	(vt) => ({
		compoundKey: primaryKey(vt.identifier, vt.token),
	})
);
export const threads = pgTable("thread", {
	id: uuid("id").defaultRandom().primaryKey(),
	text: text("text").notNull(),
	userId: text("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
	parentId: text("parent_id"),
	dialogue_id: uuid("dialogue_id"),
});

export type Thread = InferModel<typeof threads>;

export const threadsRelations = relations(threads, ({ one }) => ({
	user: one(users, {
		fields: [threads.userId],
		references: [users.id],
	}),
}));

export const userRelations = relations(users, ({ many }) => ({
	threads: many(threads),
}));
