export const sampleTransactions = [
  { symbol: 'AAPL', quantity: 100, price: 150.25, type: 'buy', date: '2023-01-15' },
  { symbol: 'MSFT', quantity: 50, price: 280.50, type: 'buy', date: '2023-02-20' },
  { symbol: 'GOOGL', quantity: 30, price: 2750.75, type: 'buy', date: '2023-03-10' },
  { symbol: 'AMZN', quantity: 40, price: 130.25, type: 'buy', date: '2023-04-05' },
  { symbol: 'NVDA', quantity: 60, price: 420.30, type: 'buy', date: '2023-05-15' },
];

export const sampleStockData = {
  AAPL: {
    lastPrice: 175.50,
    dayLow: 174.20,
    dayHigh: 176.80,
    yearLow: 140.50,
    yearHigh: 180.25,
    previousClose: 174.80
  },
  MSFT: {
    lastPrice: 315.75,
    dayLow: 314.20,
    dayHigh: 316.90,
    yearLow: 275.30,
    yearHigh: 320.45,
    previousClose: 314.90
  },
  GOOGL: {
    lastPrice: 2850.25,
    dayLow: 2845.30,
    dayHigh: 2860.40,
    yearLow: 2650.75,
    yearHigh: 2900.50,
    previousClose: 2848.80
  },
  AMZN: {
    lastPrice: 145.30,
    dayLow: 144.50,
    dayHigh: 146.20,
    yearLow: 125.40,
    yearHigh: 150.30,
    previousClose: 144.80
  },
  NVDA: {
    lastPrice: 450.25,
    dayLow: 448.90,
    dayHigh: 452.30,
    yearLow: 410.25,
    yearHigh: 455.40,
    previousClose: 449.60
  }
};