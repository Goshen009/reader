import { get, writable } from "svelte/store";

export function createTimer() {
  let timerId = null;
  const countdown = writable(0);

  const stop = () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  const handleVisibilty = () => {
    if (document.hidden) {
      stop();
    } else {
      if (get(countdown) > 0) {
        start(get(countdown))
      }
    }
  };

  const tick = () => {
    countdown.update((value) => {
      if (value <= 1) { // 1 because decrement is after this check
        document.removeEventListener("visibilitychange", handleVisibilty);
        stop();
      }

      return value - 1;
    })
  };

  const start = (seconds = 3) => {
    if (timerId) return; // Timer is already running

    countdown.set(seconds);
    document.addEventListener("visibilitychange", handleVisibilty);

    timerId = setInterval(tick, 1000);
  }

  return { start, timerId, countdown };
}