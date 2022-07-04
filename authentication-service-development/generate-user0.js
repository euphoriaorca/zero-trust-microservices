const yargs = require('yargs');
const chalk = require('chalk');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const uuid4 = require('uuid/v4');
const bcrypt = require('bcryptjs');
const cryptoRandomString = require('crypto-random-string');

// Arguments set-up
const args = yargs
  .usage('Usage -p <permissions>')
  .example('node generate-ser0.js -p "can.create.services, can.delete.services"')
  .option('p', {
    alias: 'permissions',
    describe: 'Default user permissions',
    type: 'string',
    demand: true,
  })
  .argv;

// Configure env if any
dotenv.config();

let connection;

/**
 * Check that no user(s) exist
 */
const checkUsers = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * from `users` WHERE `userType` = ?', ['USER0'], (err, users) => {
      if(err) return reject(err);
      
      if(users.length > 0) return reject('Cannot generate user0. A user already exists.');

      resolve();
    });
  });
};

/**
 * Generate user0
 */
const generateUser0 = () => {
  /* eslint-disable-next-line */
  return new Promise(async (resolve, reject) => {
    const randStr = cryptoRandomString({ length: 32 });

    const userId = uuid4();
    const permissions = args.p.split(',').map(perm => perm.trim()).filter(Boolean).map(p => p.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''));
    const hash = await bcrypt.hash(randStr, 10);
    const date = new Date();

    connection.query(
      'INSERT INTO `users` (`userId`, `password`, `userType`, `permissions`, `createdAt`, `updatedAt`) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, hash, 'USER0', permissions.join(','), date, date],
      (err) => {
        if(err) return reject(err);
        
        resolve({
          userId,
          permissions,
          password: randStr,
        });
      }
    );
  });
};

(async () => {
  /* eslint-disable-next-line */
  connection = await mysql.createConnection({
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });
  
  console.log(chalk.white.bold('\nChecking users...'));

  // Check users
  await checkUsers().then(() => {
    console.log(chalk.white.bold('Generaring user...'));

    // then generate user 0
    generateUser0().then(created => {
      console.log(chalk.white.bold('User0 generated.') + '\n');

      console.log('Username: ' + created.userId);
      console.log('Password: ' + created.password + '\n');

      process.exit(1);
    });
  }).catch(err => {
    console.error(chalk.red(err) + '\n');
    process.exit(1);
  });
})();
