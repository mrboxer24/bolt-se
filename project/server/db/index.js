import sqlite3 from 'sqlite3';
import { config } from '../config.js';

const db = new sqlite3.Database(config.DB_PATH);

// Initialize database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL,
      quantity REAL NOT NULL,
      price REAL NOT NULL,
      type TEXT CHECK(type IN ('buy', 'sell')) NOT NULL,
      date TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS stock_prices (
      symbol TEXT PRIMARY KEY,
      last_price REAL NOT NULL,
      previous_close REAL NOT NULL,
      day_high REAL NOT NULL,
      day_low REAL NOT NULL,
      year_high REAL NOT NULL,
      year_low REAL NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Promisify database operations
const runAsync = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const getAsync = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const allAsync = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export default {
  run: runAsync,
  get: getAsync,
  all: allAsync
};