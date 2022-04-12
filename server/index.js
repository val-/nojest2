const { Client } = require('pg');
const express = require('express');

const app = express();
const PORT = process.env.PORT;
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
          }, 1000);
        }
      );
    } else {
      reject();
    }
});

tryPostgresConnect(1).then(pgClient => {

  app.use(express.static('client'));

  app.get('/json/users', async (req, res) => {
    const results = await pgClient
      .query('SELECT * FROM nj_user')
      .then((payload) => {
        return payload.rows;
      })
      .catch(() => {
        throw new Error('Query failed');
      });
    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    res.send(JSON.stringify(results));
  });

  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));

});

