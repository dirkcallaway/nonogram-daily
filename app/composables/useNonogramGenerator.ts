import { createSeededRandom } from "~/utils/seededRandom";

function dateToSeed(date: string): number {
  return parseInt(date.replace(/-/g, ''), 10);
}

function generateGrid(size: number, random: () => number): number[][] {
  return Array.from({ length: size}, () =>
    Array.from({ length: size }, () => (random() > 0.5 ? 1 : 0))
);
}

function getClues(line: number[]): number[] {
  const clues: number[] = [];
  let count = 0;

  for (const cell of line) {
    if (cell === 1) {
      count++;
    } else if (count > 0) {
      clues.push(count);
      count = 0;
    }
  }

  if (count > 0) clues.push(count);
  return clues.length > 0 ? clues : [0];
}

export function useNonogramGenerator(date: string, size: number, seedOffset: number = 0) {
  const seed = dateToSeed(date) + seedOffset;
  const random = createSeededRandom(seed);

  const solution = generateGrid(size, random);
  const rowClues = solution.map(row => getClues(row));
  const colClues = Array.from({ length: size}, (_, col) =>
    getClues(solution.map(row => row[col]))
  );

  return { rowClues, colClues };
}