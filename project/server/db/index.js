import Database from 'better-sqlite3';
import { config } from '../config.js';

const db = new Database(config.DB_PATH);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT NOT NULL,
    quantity REAL NOT NULL,
    price REAL NOT NULL,
    type TEXT CHECK(type IN ('buy', 'sell')) NOT NULL,
    date TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS stock_prices (
    symbol TEXT PRIMARY KEY,
    last_price REAL NOT NULL,
    previous_close REAL NOT NULL,
    day_high REAL NOT NULL,
    day_low REAL NOT NULL,
    year_high REAL NOT NULL,
    year_low REAL NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;