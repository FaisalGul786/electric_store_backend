/**
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {users} from '../features/auth/auth.schema.js';
import {products} from '../features/product/product.schema.js';


// Validate env var
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be defined in .env');
}

//console.log("running db connection file ", process.env.DATABASE_URL)

// Create Neon client & Drizzle
const sql = neon(process.env.DATABASE_URL, {
  // Use high priority for the fetch requests
  fetchOptions: {
    priority: 'high',
  },
});
export const db = drizzle(sql, { schema: { users, products } });


// Retry wrapper
export const withRetry = async (fn, retries = 3, delay = 500) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`DB retry ${i + 1}/${retries}...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
};
**/

/**   local connection   **/

/** import 'dotenv/config';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from '../features/auth/auth.schema.js';
import { products } from '../features/product/product.schema.js';
import {
  orders,
  orderItems,
  ordersRelations,
  orderItemsRelations,
} from '../features/order/order.schema.js';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL_LOCAL });

export const db = drizzle(pool, {
  schema: {
    users,
    products,
    orders,
    orderItems,
    ordersRelations,
    orderItemsRelations,
  },
});
**/



import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" }); // or .env.local

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle({ client: sql });
