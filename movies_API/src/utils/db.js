/**
 * SQLite3 Database Connection Utility
 *
 * Establishes a connection to the main SQLite movie database.
 * Provides functionality to attach additional databases (e.g., ratings database).
 * Automatically exits the application if the connection fails.
 * Suppresses logging when in a test environment.
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../src/db/movies.db');
let ratingsAttached = false;

// Initialize the main database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
    process.exit(1);
  } else if (process.env.NODE_ENV !== 'test') {
    console.log('Connected to SQLite database');
  }
});

/**
 * Attaches the ratings database if not already attached.
 * @returns {Promise<void>}
 */
const attachRatingsDb = async () => {
  if (ratingsAttached) return;

  const attachPath = path.resolve(__dirname, '../../src/db/ratings.db');
  await new Promise((resolve, reject) => {
    db.exec(`ATTACH DATABASE '${attachPath}' AS ratingsDb;`, (err) => {
      if (err) return reject(err);
      ratingsAttached = true;
      resolve();
    });
  });
};

module.exports = {
  db,
  attachRatingsDb
};
