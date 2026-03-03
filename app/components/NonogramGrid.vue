<script setup lang="ts">
defineProps<{
  rowClues: number[][]
  colClues: number[][]
  grid: number[][]
  solved: boolean
  rowMatches?: boolean[]
  colMatches?: boolean[]
}>()

defineEmits<{
  'cell-click': [row: number, col: number]
}>()

function cellClass(state: number): string {
  if (state === 1) return 'bg-gray-900 dark:bg-gray-100';
  if (state === 2) return 'bg-gray-200 dark:bg-gray-700 text-gray-500';
  return 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700';
}
</script>

<template>
  <div
    class="inline-grid gap-px"
    :style="`grid-template-columns: auto repeat(${colClues.length}, 3rem)`"
  >
    <!-- Top-left corner -->
    <div />

    <!-- Column clues -->
    <div
      v-for="(clue, col) in colClues"
      :key="`cc-${col}`"
      class="flex flex-col items-center justify-end gap-0.5 pb-1"
      :class="colMatches !== undefined && !colMatches[col] ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'"
    >
      <span v-for="(n, i) in clue" :key="i" class="text-xs font-bold leading-none">{{ n }}</span>
    </div>

    <!-- Rows -->
    <template v-for="(row, rowIdx) in grid" :key="`row-${rowIdx}`">
      <!-- Row clue -->
      <div
        class="flex items-center justify-end gap-1 pr-2"
        :class="rowMatches !== undefined && !rowMatches[rowIdx] ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'"
      >
        <span v-for="(n, i) in rowClues[rowIdx]" :key="i" class="text-xs font-bold">{{ n }}</span>
      </div>

      <!-- Cells -->
      <button
        v-for="(cell, colIdx) in row"
        :key="`cell-${rowIdx}-${colIdx}`"
        class="w-12 h-12 border border-gray-400 dark:border-gray-600 flex items-center justify-center text-sm font-bold transition-colors"
        :class="cellClass(cell)"
        :disabled="solved"
        @click="$emit('cell-click', rowIdx, colIdx)"
      >
        <span v-if="cell === 2">✕</span>
      </button>
    </template>
  </div>
</template>