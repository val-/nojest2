const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

const tryPostgresConnect = retries => new Promise((resolve, reject) => {
  if (retries < 10) {
    const client = new Client({ connectionString });
    console.log('Postgres connection attempt: ', retries);
    client.connect().then(
      () => {
        resolve(client);
      },
      () => {
        setTimeout(() => {
          tryPostgresConnect(retries + 1).then(resolve, reject);
        }, 2000);
      }
    );
  } else {
    reject();
  }
});

module.exports = {
  tryPostgresConnect
};
