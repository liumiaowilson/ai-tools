import app from './app.js';
import { embed } from './services/embeddings.js';

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`ai-tools server listening on http://localhost:${port}`);

  // Warmup: preload the embedding model in the background
  embed(['warmup']).then(() => {
    console.log('Embedding model loaded and ready.');
  });
});
