import { sql } from "drizzle-orm";
import {
  date,
  pgTable,
  serial,
  varchar,
  bigint,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  url: varchar("url", { length: 256 }),
  created_at: date("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: date("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const category = pgTable("category", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 64 }),
});

export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 64 }),
  symbol: varchar("symbol", { length: 32 }),
  address: varchar("address", { length: 128 }).notNull(),
  chainId: integer("chainid").notNull().unique(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 256 }),
  saleEnd: bigint("saleend", { mode: "number" }),
  isDeployed: boolean("isdeployed"),
  teamA: integer("teama").references(() => players.id),
  teamB: integer("teamb").references(() => players.id),
  tokenAddress: integer("tokenaddress").references(() => tokens.id),
  category: integer("category").references(() => category.id),
});

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Category = typeof category.$inferSelect;
export type NewCategory = typeof category.$inferInsert;
export type Token = typeof tokens.$inferSelect;
export type NewToken = typeof tokens.$inferInsert;
