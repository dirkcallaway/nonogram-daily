const STORAGE_KEY = 'nonogram-daily';

export function usePuzzleStorage(date: string, size: number) {
  const key = `${STORAGE_KEY}-${date}-${size}`;

  function load(): number[][] | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function save(grid: number[][]): void {
    localStorage.setItem(key, JSON.stringify(grid));
  }

  function clear(): void {
    localStorage.removeItem(key);
  }

  return { load, save, clear };
}
