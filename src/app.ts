import express, { type Request, type Response, type NextFunction } from 'express';
import semanticSearchRouter from './routes/semantic-search.js';

const app = express();

app.use(express.json());
app.use('/ai-tools', semanticSearchRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
