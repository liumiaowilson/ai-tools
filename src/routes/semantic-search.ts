import { Router, type Request, type Response } from 'express';
import { embed } from '../services/embeddings.js';
import { cosineSimilarity } from '../services/similarity.js';

const router = Router();

interface SemanticSearchBody {
  items: string[];
  query: string;
  limit: number;
}

router.post('/semantic-search', async (req: Request, res: Response) => {
  const { items, query, limit } = req.body as SemanticSearchBody;

  // Validate input
  if (!Array.isArray(items) || items.length === 0 || !items.every(i => typeof i === 'string')) {
    res.status(400).json({ error: 'items must be a non-empty array of strings' });
    return;
  }
  if (typeof query !== 'string' || query.trim().length === 0) {
    res.status(400).json({ error: 'query must be a non-empty string' });
    return;
  }
  if (typeof limit !== 'number' || !Number.isInteger(limit) || limit < 1) {
    res.status(400).json({ error: 'limit must be a positive integer' });
    return;
  }
  if (items.length > 200) {
    res.status(400).json({ error: 'items array must not exceed 200 elements' });
    return;
  }

  const effectiveLimit = Math.min(limit, items.length);

  try {
    // Batch embed query + all items in one call
    const embeddings = await embed([query, ...items]);
    const queryEmbedding = embeddings[0];

    // Score each item against the query
    const scored = items.map((_, i) => ({
      index: i,
      score: cosineSimilarity(queryEmbedding, embeddings[i + 1]),
    }));

    // Sort by descending similarity and take top N
    scored.sort((a, b) => b.score - a.score);
    const topResults = scored.slice(0, effectiveLimit).map(({ index, score }) => ({ index, score }));

    res.json(topResults);
  } catch (err) {
    console.error('Semantic search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
