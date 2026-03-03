<script setup lang="ts">
defineProps<{
  display: string
  solved: boolean
}>()
</script>

<template>
  <div class="flex items-center gap-2 text-lg font-mono">
    <span :class="solved ? 'text-green-500' : 'text-gray-700 dark:text-gray-300'">
      {{ display }}
    </span>
    <span v-if="solved" class="text-green-500 text-sm font-sans font-semibold">
      Solved!
    </span>
  </div>
</template>