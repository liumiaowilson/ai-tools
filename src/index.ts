import app from './app.js';
import { embed } from './services/embeddings.js';

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`ai-tools server listening on http://localhost:${port}`);

  // Warmup: preload the embedding model in the background
  embed(['warmup'])
    .then(() => console.log('Embedding model loaded and ready.'))
    .catch((err) => console.error('Failed to preload embedding model:', err));
});
