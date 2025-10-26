// Optional: Express proxy to Edge route for environments without Edge runtime
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

app.post('/api/suggest-prompts', async (req, res) => {
  try {
    const resp = await fetch('http://localhost:3000/api/suggest-prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await resp.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(200).json({ suggestions: [] });
  }
});

export default app;