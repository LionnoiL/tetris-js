export const GAME_STATUS = {
  stopped: "stopped",
  running: "running",
  paused: "paused",
};

export function fillArray(array, value) {
  for (let i = 0; i < array.length; i++) {
    if (Array.isArray(array[i])) {
      fillArray(array[i], value);
    } else {
      array[i] = value;
    }
  }
}
