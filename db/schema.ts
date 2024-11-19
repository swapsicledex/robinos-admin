import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
  bigint,
  numeric,
  decimal,
} from "drizzle-orm/pg-core";

// Category Table
export const category = pgTable("category", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 64 }).notNull(),
});

// Players Table
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  symbol: varchar("symbol", { length: 63 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  category: integer("category")
    .references(() => category.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chains Table
export const chains = pgTable("chains", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 63 }).notNull(),
  chainId: integer("chain_id").notNull(),
  explorerUrl: varchar("explorer_url", { length: 63 }).notNull(),
  subdomainUrl: varchar("subdomain_url", { length: 63 }),
  isActive: boolean("is_active").default(false),
  isMainnet: boolean("is_mainnet").notNull(),
  versusAddress: varchar("versus_address", { length: 63 }),
  standardTokenAddress: varchar("standard_token_address", { length: 63 }),
  image: integer("image").references(() => players.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tokens Table
export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  symbol: varchar("symbol", { length: 31 }).notNull(),
  address: varchar("address", { length: 63 }).notNull(),
  chainId: integer("chain_id")
    .references(() => chains.id)
    .notNull(),
  image: integer("image").references(() => players.id),
  decimal: integer("decimal").notNull(),
});

// Events Table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 255 }).notNull(),
  saleEnd: bigint("sale_end", { mode: "number" }).notNull(),
  isDeployed: boolean("is_deployed").array(),
  isFeatured: boolean("is_featured").notNull(),
  teamA: integer("team_a")
    .references(() => players.id)
    .notNull(),
  teamB: integer("team_b")
    .references(() => players.id)
    .notNull(),
  tokenAddress: integer("token_address")
    .references(() => tokens.id)
    .notNull(),
  category: integer("category")
    .references(() => category.id)
    .notNull(),
  conditions: text("conditions").array(),
  onChains: numeric("on_chains").array().notNull(),
  handicap: decimal("handicap")
});

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Category = typeof category.$inferSelect;
export type NewCategory = typeof category.$inferInsert;
export type Token = typeof tokens.$inferSelect;
export type NewToken = typeof tokens.$inferInsert;
export type Chain = typeof chains.$inferSelect;
export type NewChain = typeof chains.$inferInsert;
