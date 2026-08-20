import app from './app';
import config from './config';
import { initDb } from './db';

const main = async () => {
  try {
    await initDb();
  } catch (err: any) {
    const detail = Array.isArray(err?.errors) && err.errors.length
      ? err.errors.map((e: any) => e.message || String(e)).join('; ')
      : err?.message || err;
    console.error('❌ Failed to connect to the database. Check your DATABASE_URL in .env');
    console.error('Reason:', detail);
    process.exit(1);
  }

  app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
  });
};

main();