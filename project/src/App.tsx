import React, { useState, useEffect } from 'react';
import { LineChart } from 'lucide-react';
import { addTransaction, getPositions } from './api';
import { StockPosition, Transaction } from './types';
import StockTable from './components/StockTable';

function App() {
  const [positions, setPositions] = useState<StockPosition[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Transaction>({
    symbol: '',
    quantity: 0,
    price: 0,
    type: 'buy'
  });

  const fetchData = async () => {
    try {
      setError(null);
      const data = await getPositions();
      setPositions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await addTransaction(formData);
      setFormData({ symbol: '', quantity: 0, price: 0, type: 'buy' });
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
    }
  };

  const totalValue = positions.reduce((sum, pos) => sum + pos.currentValue, 0);
  const totalGain = positions.reduce((sum, pos) => sum + pos.totalGain, 0);
  const todayGain = positions.reduce((sum, pos) => sum + pos.todayGain, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LineChart className="w-8 h-8" />
            Stock Portfolio Manager
          </h1>
          <div className="text-right">
            <div className="text-2xl font-bold">{totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
            <div className={`text-sm ${totalGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              Total Gain: {totalGain.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </div>
            <div className={`text-sm ${todayGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              Today's Gain: {todayGain.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <StockTable positions={positions} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Symbol"
              className="border rounded p-2"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              className="border rounded p-2"
              value={formData.quantity || ''}
              onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
              required
              min="0"
              step="any"
            />
            <input
              type="number"
              placeholder="Price"
              className="border rounded p-2"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
              min="0"
              step="any"
            />
            <select
              className="border rounded p-2"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'buy' | 'sell' })}
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors md:col-span-2 lg:col-span-4"
            >
              Add Transaction
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;