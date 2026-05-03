import express, { type Request, type Response, type NextFunction } from 'express';
import semanticSearchRouter from './routes/semantic-search.js';
import embeddingRouter from './routes/embedding.js';

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use('/ai-tools', semanticSearchRouter);
app.use('/ai-tools', embeddingRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
