export function fillArray(array, value) {
  for (let i = 0; i < array.length; i++) {
    if (Array.isArray(array[i])) {
      fillArray(array[i], value);
    } else {
      array[i] = value;
    }
  }
}

export function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function playSound(audio) {
  audio.currentTime = 0;
  audio.play().catch((err) => console.error(err));
}
