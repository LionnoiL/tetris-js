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

export const SOUNDS = {
  drop: new Audio("./sounds/drop.wav"),
};
