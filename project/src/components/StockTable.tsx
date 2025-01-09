import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { StockPosition } from '../types';

type Props = {
  positions: StockPosition[];
};

export default function StockTable({ positions }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Symbol</th>
            <th className="text-right py-2">Last Price</th>
            <th className="text-right py-2">Quantity</th>
            <th className="text-right py-2">Cost Basis</th>
            <th className="text-right py-2">Current Value</th>
            <th className="text-right py-2">Today's Gain</th>
            <th className="text-right py-2">Total Gain</th>
            <th className="text-right py-2">Day Range</th>
            <th className="text-right py-2">52W Range</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => {
            const isPositive = position.totalGain > 0;
            const TrendIcon = isPositive ? TrendingUp : TrendingDown;
            const trendColor = isPositive ? 'text-green-500' : 'text-red-500';

            return (
              <tr key={position.symbol} className="border-b hover:bg-gray-50">
                <td className="py-3 font-medium">{position.symbol}</td>
                <td className="text-right">{formatCurrency(position.lastPrice)}</td>
                <td className="text-right">{position.quantity}</td>
                <td className="text-right">{formatCurrency(position.costBasis)}</td>
                <td className="text-right">{formatCurrency(position.currentValue)}</td>
                <td className={`text-right ${position.todayGain > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(position.todayGain)} ({formatPercentage(position.todayGainPercent)})
                </td>
                <td className={`text-right ${trendColor} flex items-center justify-end gap-1`}>
                  <TrendIcon className="w-4 h-4" />
                  {formatCurrency(position.totalGain)} ({formatPercentage(position.totalGainPercent)})
                </td>
                <td className="text-right">
                  {formatCurrency(position.dayLow)} - {formatCurrency(position.dayHigh)}
                </td>
                <td className="text-right">
                  {formatCurrency(position.yearLow)} - {formatCurrency(position.yearHigh)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}