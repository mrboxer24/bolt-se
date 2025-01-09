import axios from 'axios';
import { config } from '../config.js';
import db from '../db/index.js';

export async function fetchStockPrice(symbol) {
  try {
    const response = await axios.get(`${config.FINNHUB_URL}/quote`, {
      params: {
        symbol,
        token: config.API_KEY
      }
    });

    const data = response.data;
    if (!data) {
      throw new Error('No data available for symbol');
    }

    const price = {
      symbol,
      last_price: data.c,
      previous_close: data.pc,
      day_high: data.h,
      day_low: data.l,
      year_high: data.h, // Using day high as year high temporarily
      year_low: data.l   // Using day low as year low temporarily
    };

    // Update stock prices in database
    await db.run(
      `INSERT OR REPLACE INTO stock_prices 
      (symbol, last_price, previous_close, day_high, day_low, year_high, year_low)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        price.symbol,
        price.last_price,
        price.previous_close,
        price.day_high,
        price.day_low,
        price.year_high,
        price.year_low
      ]
    );

    return price;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error.message);
    throw error;
  }
}

export async function getStoredPrice(symbol) {
  return db.get('SELECT * FROM stock_prices WHERE symbol = ?', [symbol]);
}