import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
  bigint,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";

export const networkEnum = pgEnum("network", [
  "taiko",
  "telos",
  "mantle",
  "kaspaTestnet",
  "abstractTestnet",
]);

// Category Table
export const category = pgTable("category", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 64 }).notNull(),
  imageUrl: varchar("image_url", { length: 127 }),
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
  tournament: integer("tournament").references(() => tournaments.id),
});

// Chains Table
export const chains = pgTable("chains", {
  name: varchar("name", { length: 63 }).notNull(),
  chainId: integer("chain_id").primaryKey(),
  explorerUrl: varchar("explorer_url", { length: 63 }).notNull(),
  subdomainUrl: varchar("subdomain_url", { length: 63 }),
  isActive: boolean("is_active").default(false),
  isMainnet: boolean("is_mainnet").notNull(),
  versusAddress: varchar("versus_address", { length: 63 }),
  standardTokenAddress: varchar("standard_token_address", { length: 63 }),
  imageUrl: varchar("image_url", { length: 127 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tokens Table
export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 63 }),
  symbol: varchar("symbol", { length: 31 }).notNull(),
  address: varchar("address", { length: 63 }).notNull(),
  chainId: integer("chain_id")
    .references(() => chains.chainId)
    .notNull(),
  imageUrl: varchar("image_url", { length: 127 }),
  decimal: integer("decimal").notNull(),
});

// Events Table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 255 }).notNull(),
  saleEnd: bigint("sale_end", { mode: "number" }).notNull(),
  saleStart: bigint("sale_start", { mode: "number" }).default(0),
  isDeployed: boolean("is_deployed").default(false),
  isFeatured: boolean("is_featured").notNull(),
  isDeleted: boolean("is_deleted").default(false),
  chainId: integer("chain_id")
    .references(() => chains.chainId)
    .notNull(),
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
  tournament: integer("tournament").references(() => tournaments.id),
  conditions: text("conditions").array(),
  handicapTeamA: varchar("handicap_team_a", { length: 31 }),
  handicapTeamB: varchar("handicap_team_b", { length: 31 }),
  network: networkEnum("network").notNull(),
});

// Tournaments table
export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  category: integer("category").references(() => category.id), // Foreign key to category table
  name: varchar("name", { length: 63 }).notNull(),
  imageUrl: varchar("image_url", { length: 127 }),
});

export const robinosEvents = pgTable(
  "robinos_events",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 255 }).notNull(),
    saleEnd: bigint("sale_end", { mode: "number" }).notNull(),
    saleStart: bigint("sale_start", { mode: "number" }).default(0),
    isDeployed: boolean("is_deployed").default(false),
    isFeatured: boolean("is_featured").notNull(),
    isDeleted: boolean("is_deleted").default(false),
    chainId: integer("chain_id")
      .references(() => chains.chainId)
      .notNull(),
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
    tournament: integer("tournament").references(() => tournaments.id),
    conditions: text("conditions").array(),
    handicapTeamA: varchar("handicap_team_a", { length: 31 }),
    handicapTeamB: varchar("handicap_team_b", { length: 31 }),
    predictionNetwork: networkEnum("prediction_network").notNull(),
    totalDepositA: bigint("total_deposit_a", { mode: "number" }),
    totalDepositB: bigint("total_deposit_b", { mode: "number" }),
    isRefund: boolean("is_refund"),
    isCancelled: boolean("is_cancelled"),
    isReward: boolean("is_reward"),
    hasWinner: boolean("has_winner"),
    winnerIndex: boolean("winner_index"),
  },
  (table) => ({
    uniqueCodeNetwork: uniqueIndex("unique_constraint_name").on(
      table.code,
      table.predictionNetwork
    ),
  })
);

export const stakedEvents = pgTable("staked_events", {
  predictionCode: varchar("prediction_code", { length: 255 }).notNull(),
  network: networkEnum("network").notNull(),
  user: varchar("user", { length: 31 }).notNull(),
  userDepositA: bigint("user_deposit_a", { mode: "number" }),
  userDepositB: bigint("user_deposit_b", { mode: "number" }),
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
export type Tournament = typeof tournaments.$inferSelect;
export type NewTournament = typeof tournaments.$inferInsert;
