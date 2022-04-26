const express = require('express');
const session = require('express-session');
const pg = require('pg');
const pgSession = require('connect-pg-simple')(session);
const path = require('path');

const { tryPostgresConnect } = require('./tryPostgresConnect');

const app = express();
const PORT = process.env.PORT;

tryPostgresConnect(1).then(pgClient => {

  app.use(express.static('client/build'));

  const connectionString = process.env.DATABASE_URL;
  const pgPool = new pg.Pool({ connectionString });

  app.use(session({
      store: new pgSession({
          pool: pgPool,
          //conString: pgPool,
          tableName: 'nj_session',
      }),
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
  }));

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

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + './../client/build/index.html'));
  });

  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));

});

