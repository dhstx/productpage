import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

console.log('='.repeat(50));
console.log('MINIMAL SERVER STARTING');
console.log('PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('='.repeat(50));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Minimal server is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log(`✅ SERVER LISTENING ON PORT ${PORT}`);
  console.log(`✅ SERVER BOUND TO 0.0.0.0:${PORT}`);
  console.log('='.repeat(50));
});

