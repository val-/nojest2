const express = require('express');
const { tryPostgresConnect } = require('./tryPostgresConnect');

const app = express();
const PORT = process.env.PORT;

tryPostgresConnect(1).then(pgClient => {

  app.use(express.static('client/public'));

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

