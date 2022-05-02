const express = require('express');
const session = require('express-session');
const pg = require('pg');
const pgSession = require('connect-pg-simple')(session);
const path = require('path');
require('dotenv').config();

const db = require('./config/database');

const app = express();
const PORT = process.env.PORT;
const apiRoutes = require('./api/routes');

db.tryPostgresConnect(1).then(() => {

  app.use(express.static('client/build'));

  const connectionString = process.env.DATABASE_URL;
  const pgPool = new pg.Pool({ connectionString });

  app.use(session({
      store: new pgSession({
          pool: pgPool,
          tableName: 'nj_session',
      }),
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
  }));

  app.use('/api', apiRoutes);

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + './../client/build/index.html'));
  });

  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));

});

