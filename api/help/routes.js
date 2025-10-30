import express from 'express';
import { optionalAuth } from '../middleware/optionalAuth.js';

const router = express.Router();

// POST /api/help/feedback
router.post('/feedback', optionalAuth, async (req, res) => {
  try {
    const { slug, helpful, notes } = req.body || {};
    // Basic validation
    if (typeof helpful !== 'boolean') {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    // Avoid PII by default
    const payload = {
      slug: String(slug || ''),
      helpful,
      notes: typeof notes === 'string' ? notes.slice(0, 1000) : '',
      at: new Date().toISOString(),
    };
    // For now, log to server; could persist later
    console.log('[help.feedback]', payload);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
