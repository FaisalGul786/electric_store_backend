import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
dotenv.config()
console.log('message check ...', process.env.DATABASE_URL_LOCAL);
export default defineConfig({
  schema: './src/features/**/*.schema.js',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});


