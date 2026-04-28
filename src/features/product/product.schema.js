import { 
  pgTable, 
  serial, 
  text, 
  varchar, 
  integer, 
  boolean, 
  real,
  doublePrecision
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  price: doublePrecision("price").notNull(),  
  inStock: boolean("in_stock").default(true),
  rating: real("rating").default(0),
  reviews: integer("reviews").default(0),
  image: text("image"),
});
