import express from 'express';
import semanticSearchRouter from './routes/semantic-search.js';

const app = express();

app.use(express.json());
app.use('/ai-tools', semanticSearchRouter);

export default app;
