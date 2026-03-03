<script setup lang="ts">
import { ref, computed } from 'vue';
import { useNonogramGenerator } from '~/composables/useNonogramGenerator';

defineEmits<{ close: [] }>();

const { rowClues, colClues } = useNonogramGenerator('00000000', 3, 0);

const grid = ref<number[][]>(
  Array.from({ length: 3 }, () => Array(3).fill(0))
);

function cycleCell(row: number, col: number) {
  if (isSolved.value) return;
  grid.value[row]![col] = (grid.value[row]![col]! + 1) % 3;
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

function cluesMatch(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

const isSolved = computed(() => {
  const rowsMatch = grid.value.every((row, i) => cluesMatch(getClues(row), rowClues[i]!));
  const colsMatch = Array.from({ length: 3 }, (_, col) =>
    cluesMatch(getClues(grid.value.map(row => row[col]!)), colClues[col]!)
  ).every(Boolean);
  return rowsMatch && colsMatch;
});

function reset() {
  grid.value = Array.from({ length: 3 }, () => Array(3).fill(0));
}
</script>

<template>
  <!-- Backdrop -->
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <!-- Modal card -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100">How to Play</h2>
        <button
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none"
          @click="$emit('close')"
        >✕</button>
      </div>

      <!-- Body -->
      <div class="flex flex-col-reverse sm:flex-row gap-6 px-6 py-5">

        <!-- Left: interactive grid -->
        <div class="flex flex-col items-center gap-3 shrink-0">
          <NonogramGrid
            :row-clues="rowClues"
            :col-clues="colClues"
            :grid="grid"
            :solved="isSolved"
            @cell-click="cycleCell"
          />
          <p v-if="isSolved" class="text-green-500 font-semibold text-sm">You solved it! 🎉</p>
          <button
            class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline"
            @click="reset"
          >Reset</button>
        </div>

        <!-- Right: steps -->
        <ol class="flex flex-col gap-4 text-sm text-gray-700 dark:text-gray-300">
          <li class="flex gap-3">
            <span class="font-bold text-gray-900 dark:text-gray-100 shrink-0">1.</span>
            <span>
              <strong class="text-gray-900 dark:text-gray-100">Read the clues.</strong>
              The numbers along each row and column tell you how many consecutive filled cells appear in that line, in order. A clue of <strong>2 1</strong> means a group of 2, then a gap, then a group of 1.
            </span>
          </li>
          <li class="flex gap-3">
            <span class="font-bold text-gray-900 dark:text-gray-100 shrink-0">2.</span>
            <span>
              <strong class="text-gray-900 dark:text-gray-100">Click to interact.</strong>
              Tap a cell to fill it. Tap again to mark it <strong>✕</strong> (a cell you know is empty). Tap once more to clear it.
            </span>
          </li>
          <li class="flex gap-3">
            <span class="font-bold text-gray-900 dark:text-gray-100 shrink-0">3.</span>
            <span>
              <strong class="text-gray-900 dark:text-gray-100">Match every clue.</strong>
              When your filled cells satisfy all the row and column clues, the puzzle is solved. Try it on the grid!
            </span>
          </li>
        </ol>
      </div>

      <!-- Footer -->
      <div class="px-6 pb-5 flex justify-end">
        <button
          class="px-5 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold text-sm hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
          @click="$emit('close')"
        >Got it</button>
      </div>

    </div>
  </div>
</template>
