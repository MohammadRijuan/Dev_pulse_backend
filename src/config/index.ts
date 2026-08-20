import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
export const CORS_ALLOWED_METHODS = process.env.CORS_ALLOWED_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE';

const config = { port: PORT, databaseUrl: DATABASE_URL, jwtSecret: JWT_SECRET, corsOrigin: CORS_ORIGIN };
export default config;