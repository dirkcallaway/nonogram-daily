import { ref, computed } from 'vue';

const TIMER_KEY = 'nonogram-daily-timer';

export function useTimer(date: string, size: number) {
  const key = `${TIMER_KEY}-${date}-${size}`;

  const elapsed = ref(loadElapsed());
  const running = ref(false);
  let interval: ReturnType<typeof setInterval> | null = null;

  function loadElapsed(): number {
    const raw = localStorage.getItem(key);
    return raw ? parseInt(raw, 10) : 0;
  }

  function start() {
    if (running.value) return;
    running.value = true;
    interval = setInterval(() => {
      elapsed.value++;
      localStorage.setItem(key, String(elapsed.value));
    }, 1000);
  }

  function stop() {
    if (!running.value) return;
    running.value = false;
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  const display = computed(() => {
    const m = Math.floor(elapsed.value / 60).toString().padStart(2, '0');
    const s = (elapsed.value % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  });

  return { elapsed, running, display, start, stop };
}