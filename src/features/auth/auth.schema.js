import { pgTable, serial,  varchar, timestamp, pgEnum, text } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("role", ["customer", "admin"]);

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 150 }).notNull().unique(),
    ship_address: text("ship_address").notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    role: userRoleEnum("role").notNull().default("customer"),
    created_at: timestamp("created_at").defaultNow().notNull(),
});
