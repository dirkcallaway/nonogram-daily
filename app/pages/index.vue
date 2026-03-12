<script setup lang="ts">
import {ref, watch } from 'vue';
import { useNonogramGenerator } from '~/composables/useNonogramGenerator';
import { usePuzzleState } from '~/composables/usePuzzleState';
import { useTimer } from '~/composables/useTimer';

const _d = new Date();
const today = `${_d.getFullYear()}-${String(_d.getMonth() + 1).padStart(2, '0')}-${String(_d.getDate()).padStart(2, '0')}`;
const activeTab = ref<5 | 7>(5);
const showHelp = ref(false);

const puzzle5 = useNonogramGenerator(today, 5, 0);
const puzzle7 = useNonogramGenerator(today, 7, 1);

const state5 = usePuzzleState(today, 5, puzzle5.rowClues, puzzle5.colClues);
const state7 = usePuzzleState(today, 7, puzzle7.rowClues, puzzle7.colClues);

const timer5 = useTimer(today, 5);
const timer7 = useTimer(today, 7);

const checkResult5 = ref<{ rowMatches: boolean[], colMatches: boolean[] } | null>(null);
const checkResult7 = ref<{ rowMatches: boolean[], colMatches: boolean[] } | null>(null);

function handleCellClick5(row: number, col: number) {
  if (state5.isSolved.value) return;
  timer5.start();
  state5.cycleCell(row, col);
  checkResult5.value = null;
  if (state5.isSolved.value) timer5.stop();
}

function handleCellClick7(row: number, col: number) {
  if (state7.isSolved.value) return;
  timer7.start();
  state7.cycleCell(row, col);
  checkResult7.value = null;
  if (state7.isSolved.value) timer7.stop();
}

function handleCheck5() {
  checkResult5.value = state5.checkProgress();
}

function handleCheck7() {
  checkResult7.value = state7.checkProgress();
}

watch(() => state5.isSolved.value, (solved) => { if (solved) checkResult5.value = null });
watch(() => state7.isSolved.value, (solved) => { if (solved) checkResult7.value = null });
</script>

<template>
  <main class="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center py-10 px-4">
    <div class="flex items-center gap-2 mb-1">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Nonogram Daily</h1>
      <button
        class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
        @click="showHelp = true"
      >?</button>
    </div>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
      {{ new Date(today + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
    </p>

    <!-- Tabs -->
    <div class="flex gap-2 mb-8">
      <button
        v-for="size in [5, 7]"
        :key="size"
        class="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
        :class="activeTab === size
          ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
        @click="activeTab = size as 5 | 7"
      >
        {{ size }}×{{ size }}
      </button>
    </div>

    <!-- 5x5 Puzzle -->
    <div v-show="activeTab === 5" class="flex flex-col items-center gap-4 w-max">
      <PuzzleTimer :display="timer5.display.value" :solved="state5.isSolved.value" />
      <NonogramGrid
        :row-clues="puzzle5.rowClues"
        :col-clues="puzzle5.colClues"
        :grid="state5.grid.value"
        :solved="state5.isSolved.value"
        :row-matches="checkResult5?.rowMatches"
        :col-matches="checkResult5?.colMatches"
        @cell-click="handleCellClick5"
      />
      <button
        v-if="!state5.isSolved.value"
        class="mt-2 px-4 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        @click="handleCheck5"
      >
        Check Progress
      </button>
      <ShareButton :date="today" :size="5" :display="timer5.display.value" :solved="state5.isSolved.value" />
    </div>

    <!-- 7x7 Puzzle -->
    <div v-show="activeTab === 7" class="flex flex-col items-center gap-4 w-max">
      <PuzzleTimer :display="timer7.display.value" :solved="state7.isSolved.value" />
      <NonogramGrid
        :row-clues="puzzle7.rowClues"
        :col-clues="puzzle7.colClues"
        :grid="state7.grid.value"
        :solved="state7.isSolved.value"
        :row-matches="checkResult7?.rowMatches"
        :col-matches="checkResult7?.colMatches"
        @cell-click="handleCellClick7"
      />
      <button
        v-if="!state7.isSolved.value"
        class="mt-2 px-4 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        @click="handleCheck7"
      >
        Check Progress
      </button>
      <ShareButton :date="today" :size="7" :display="timer7.display.value" :solved="state7.isSolved.value" />
    </div>

    <HowToPlayModal v-if="showHelp" @close="showHelp = false" />
  </main>
</template>