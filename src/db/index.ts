import { Pool } from 'pg';
import config from '../config';
import fs from 'fs';
import path from 'path';

export const pool = new Pool({ connectionString: (config as any).connection_string || (config as any).databaseUrl });

export const initDb = async () => {
	try {
		const schemaPath = path.resolve(__dirname, '..', 'sql', 'schema.sql');
		if (fs.existsSync(schemaPath)) {
			const sql = fs.readFileSync(schemaPath, 'utf8');
			await pool.query(sql);
			console.log('Database schema applied from', schemaPath);
		} else {
			console.warn('No schema.sql found at', schemaPath);
		}
		console.log('database connected successfully!');
	} catch (error) {
		console.error('Failed to initialize database', error);
		throw error;
	}
};

export const query = (text: string, params?: any[]) => pool.query(text, params);

