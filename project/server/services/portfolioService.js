import db from '../db/index.js';
import { getStoredPrice, fetchStockPrice } from './stockService.js';

export async function getPositions() {
  const holdings = await db.all(`
    SELECT 
      symbol,
      SUM(CASE WHEN type = 'buy' THEN quantity ELSE -quantity END) as quantity,
      SUM(CASE WHEN type = 'buy' THEN quantity * price ELSE -quantity * price END) as total_cost
    FROM transactions
    GROUP BY symbol
    HAVING quantity > 0
  `);

  const positions = await Promise.all(holdings.map(async (holding) => {
    let stockData;
    try {
      // Try to fetch fresh data
      stockData = await fetchStockPrice(holding.symbol);
    } catch (error) {
      // Fall back to stored data
      stockData = await getStoredPrice(holding.symbol);
      if (!stockData) {
        throw new Error(`No price data available for ${holding.symbol}`);
      }
    }

    const currentValue = holding.quantity * stockData.last_price;
    const costBasis = holding.total_cost;
    const todayGain = holding.quantity * (stockData.last_price - stockData.previous_close);
    const totalGain = currentValue - costBasis;

    return {
      symbol: holding.symbol,
      lastPrice: stockData.last_price,
      quantity: holding.quantity,
      costBasis: costBasis,
      currentValue: currentValue,
      todayGain: todayGain,
      todayGainPercent: (todayGain / costBasis) * 100,
      totalGain: totalGain,
      totalGainPercent: (totalGain / costBasis) * 100,
      dayLow: stockData.day_low,
      dayHigh: stockData.day_high,
      yearLow: stockData.year_low,
      yearHigh: stockData.year_high
    };
  }));

  return positions;
}

export async function addTransaction(transaction) {
  return db.run(
    'INSERT INTO transactions (symbol, quantity, price, type) VALUES (?, ?, ?, ?)',
    [transaction.symbol, transaction.quantity, transaction.price, transaction.type]
  );
}