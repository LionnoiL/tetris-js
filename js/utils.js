export function fillArray(array, value) {
  array.forEach((item, i) => {
    Array.isArray(item) ? fillArray(item, value) : (array[i] = value);
  });
}

export function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function playSound(audio) {
  audio.currentTime = 0;
  audio.play().catch((err) => console.error(err));
}
