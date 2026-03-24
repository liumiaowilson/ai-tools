import { pipeline } from '@huggingface/transformers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let extractorPromise: Promise<any> | null = null;

function getExtractor() {
  if (!extractorPromise) {
    console.log('Loading embedding model (first time may download ~23MB)...');
    extractorPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2' as any)
      .catch((err) => {
        extractorPromise = null; // Allow retry on next request
        throw err;
      });
  }
  return extractorPromise;
}

const BATCH_SIZE = 20;

export async function embed(texts: string[]): Promise<number[][]> {
  const extractor = await getExtractor();
  const results: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const output = await extractor(batch, { pooling: 'mean', normalize: true });
    results.push(...output.tolist());
  }

  return results;
}
