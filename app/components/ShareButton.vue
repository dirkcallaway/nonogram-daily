<script setup lang="ts">
import { ref } from 'vue';

  const props = defineProps<{
    date: string
    size: number
    display: string
    solved: boolean
  }>();

  const copied = ref(false);

  function buildShareText(): string {
    const formattedDate = new Date(props.date + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    return `Nonogram Daily - ${formattedDate}\n${props.size} solved in ${props.display} ✅`;
  }

  async function share() {
    const text = buildShareText();
    await navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  }
</script>

<template>
  <div v-if="solved" class="flex justify-center w-full">
    <button
      class="mt-4 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
      @click="share"
    >
      {{ copied ? 'Copied!' : 'Share Result' }}
    </button>
  </div>
</template>