export type StockPosition = {
  symbol: string;
  lastPrice: number;
  quantity: number;
  costBasis: number;
  currentValue: number;
  todayGain: number;
  todayGainPercent: number;
  totalGain: number;
  totalGainPercent: number;
  dayLow: number;
  dayHigh: number;
  yearLow: number;
  yearHigh: number;
};

export type Transaction = {
  symbol: string;
  quantity: number;
  price: number;
  type: 'buy' | 'sell';
};