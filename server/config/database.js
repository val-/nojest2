const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL;
let client;

//console.log('connectionString: ', connectionString);

const tryPostgresConnect = retries => new Promise((resolve, reject) => {
  if (retries < 10) {
    console.log('Postgres connection attempt: ', retries);
    client = new Client({ connectionString });
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

const query = (text, values) => new Promise(function(resolve, reject) {
    client.query(text, values, (err, result) => {
        if (err) {
            handleErrorMessages(err).then((message) => {
                reject(message);
            }).catch(() => {
                reject();
            });
        } else {
            resolve(result);
        }
    });
});

const handleErrorMessages = err => new Promise((resolve) => {
    if (err.code == '23505') {
        err = 'email already in use'
    } else if (err.code == '22P02') {
        err = 'invalid user UUID'
    } else {
        err = `Something went wrong, error code: ${err.code}`
    }
    resolve(err);
});

module.exports = {
    tryPostgresConnect,
    query,
};
