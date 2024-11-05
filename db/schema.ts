import { sql } from "drizzle-orm";
import {
  date,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  url: varchar("last_name", { length: 256 }),
  created_at: date("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: date("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
