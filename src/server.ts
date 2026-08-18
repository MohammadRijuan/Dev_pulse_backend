import app from './app';
import config from './config';
import { initDb } from './db';

const main = async () => {
  await initDb();

  app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
  });
};

main();
