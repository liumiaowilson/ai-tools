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

export async function embed(texts: string[]): Promise<number[][]> {
  const extractor = await getExtractor();
  const output = await extractor(texts, { pooling: 'mean', normalize: true });
  return output.tolist();
}
