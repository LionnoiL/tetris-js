export const GAME_STATUS = {
  stopped: "stopped",
  running: "running",
  paused: "paused",
};

export const SPEED_LIMITS = [
  [5000, 500],
  [10000, 400],
  [15000, 300],
  [20000, 200],
  [25000, 100],
  [30000, 70],
];

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
