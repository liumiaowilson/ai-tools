import { Router, type Request, type Response } from 'express';
import { embed } from '../services/embeddings.js';

const router = Router();

const MAX_TEXT_CHARS = 200_000;

interface EmbeddingBody {
  text: string;
}

router.post('/embedding', async (req: Request, res: Response) => {
  const { text } = req.body as EmbeddingBody;

  if (typeof text !== 'string' || text.trim().length === 0) {
    res.status(400).json({ error: 'text must be a non-empty string' });
    return;
  }
  if (text.length > MAX_TEXT_CHARS) {
    res.status(400).json({ error: `text must not exceed ${MAX_TEXT_CHARS} characters` });
    return;
  }

  try {
    const [embedding] = await embed([text]);
    res.json({ embedding });
  } catch (err) {
    console.error('Embedding error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
