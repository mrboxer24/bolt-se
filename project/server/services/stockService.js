import axios from 'axios';
import { config } from '../config.js';
import db from '../db/index.js';

export async function fetchStockPrice(symbol) {
  try {
    const response = await axios.get(config.ALPHA_VANTAGE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: config.API_KEY
      }
    });

    const data = response.data['Global Quote'];
    if (!data) {
      throw new Error('No data available for symbol');
    }

    const price = {
      symbol,
      last_price: parseFloat(data['05. price']),
      previous_close: parseFloat(data['08. previous close']),
      day_high: parseFloat(data['03. high']),
      day_low: parseFloat(data['04. low']),
      // Note: Using day high/low as year high/low since Alpha Vantage's free tier doesn't provide this
      year_high: parseFloat(data['03. high']),
      year_low: parseFloat(data['04. low'])
    };

    // Update stock prices in database
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO stock_prices 
      (symbol, last_price, previous_close, day_high, day_low, year_high, year_low)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      price.symbol,
      price.last_price,
      price.previous_close,
      price.day_high,
      price.day_low,
      price.year_high,
      price.year_low
    );

    return price;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error.message);
    throw error;
  }
}

export function getStoredPrice(symbol) {
  return db.prepare('SELECT * FROM stock_prices WHERE symbol = ?').get(symbol);
}