import express from 'express';
import cors from 'cors';
import { getPositions, addTransaction } from './services/portfolioService.js';
import { config } from './config.js';

const app = express();

app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Add transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const result = addTransaction(req.body);
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get positions with live data
app.get('/api/positions', async (req, res) => {
  try {
    const positions = await getPositions();
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});