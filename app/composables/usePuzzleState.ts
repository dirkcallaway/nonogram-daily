import { ref, computed } from 'vue';
import { usePuzzleStorage } from './usePuzzleStorage';

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

function cluesMatch(a: number[], b:number[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

export function usePuzzleState(
  date: string,
  size: number,
  rowClues: number[][],
  colClues: number[][],
) {
  const storage = usePuzzleStorage(date, size);

  const grid = ref<number[][]>(
    storage.load() ?? Array.from({ length: size }, () => Array(size).fill(0))
  );

  function cycleCell(row:number, col: number) {
    grid.value[row]![col] = (grid.value[row]![col]! + 1) % 3;
    storage.save(grid.value);
  }

  function clearGrid() {
    grid.value = Array.from({ length: size }, () => Array(size).fill(0));
    storage.save(grid.value);
  }

  function checkProgress() {
    const rowMatches = grid.value.map((row, i) =>
    cluesMatch(getClues(row), rowClues[i]!)
  )
  const colMatches = Array.from({ length: size }, (_, col) =>
    cluesMatch(
      getClues(grid.value.map(row => row[col]!)),
      colClues[col]!

    )
  );
  return { rowMatches, colMatches };
  }

  const isSolved = computed(() => {
    const { rowMatches, colMatches } = checkProgress();
    return rowMatches.every(Boolean) && colMatches.every(Boolean);
  })

  return { grid, cycleCell, clearGrid, checkProgress, isSolved };
}