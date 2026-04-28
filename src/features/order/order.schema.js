/**import { pgTable, serial, integer, numeric, varchar, timestamp, text, pgEnum } from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

import { products } from "../product/product.schema.js";
import { users } from "../auth/auth.schema.js";

export const orderStatusEnum = pgEnum("order_status", ["pending", "ship"]);
// Orders Table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  orderStatus: orderStatusEnum("order_status").notNull().default("pending"),
  orderDate: timestamp("order_date").defaultNow().notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  shippingAddress: text("shipping_address").notNull(),
});

// Order Items Table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// relations to fetch data from multiple tabel 
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, { // Add this link!
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

**/



import {
  pgTable, serial, integer, numeric,
  varchar, timestamp, text, pgEnum
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { products } from "../product/product.schema.js";
import { users } from "../auth/auth.schema.js";

export const orderStatusEnum = pgEnum("order_status", ["pending", "ship"]);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  orderStatus: orderStatusEnum("order_status").notNull().default("pending"),
  orderDate: timestamp("order_date").defaultNow().notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  shippingAddress: text("shipping_address").notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  userId: integer("user_id")                          
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  orderTimePrice: numeric("order_time_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Relations ───────────────────────────────────────────────
export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [orderItems.userId],
    references: [users.id],
  }),
}));
