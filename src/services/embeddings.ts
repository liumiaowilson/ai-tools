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
const CHUNK_CHARS = 800;

function chunk(text: string): string[] {
  if (text.length <= CHUNK_CHARS) return [text];
  const out: string[] = [];
  for (let i = 0; i < text.length; i += CHUNK_CHARS) {
    out.push(text.slice(i, i + CHUNK_CHARS));
  }
  return out;
}

export async function embed(texts: string[]): Promise<number[][]> {
  const extractor = await getExtractor();

  const flat: string[] = [];
  const ownerOf: number[] = [];
  texts.forEach((t, i) => {
    const chunks = chunk(t);
    for (const c of chunks) {
      flat.push(c);
      ownerOf.push(i);
    }
  });

  const chunkVecs: number[][] = [];
  for (let i = 0; i < flat.length; i += BATCH_SIZE) {
    const batch = flat.slice(i, i + BATCH_SIZE);
    const output = await extractor(batch, { pooling: 'mean', normalize: true, truncation: true });
    chunkVecs.push(...output.tolist());
  }

  const dim = chunkVecs[0]?.length ?? 0;
  const sums: number[][] = texts.map(() => new Array(dim).fill(0));
  const counts: number[] = texts.map(() => 0);
  chunkVecs.forEach((v, i) => {
    const o = ownerOf[i];
    for (let d = 0; d < dim; d++) sums[o][d] += v[d];
    counts[o]++;
  });

  return sums.map((s, i) => {
    const n = counts[i] || 1;
    const avg = s.map(x => x / n);
    let mag = 0;
    for (const x of avg) mag += x * x;
    mag = Math.sqrt(mag) || 1;
    return avg.map(x => x / mag);
  });
}
