export const TETROMINOES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

export const COLORS = {
  I: "cyan",
  O: "yellow",
  T: "purple",
  S: "green",
  Z: "red",
  J: "blue",
  L: "orange",
};

export class Tetromino {
  constructor(type) {
    this.type = type;
    this.data = TETROMINOES[type];
    this.color = COLORS[type];
    this.x = 0;
    this.y = 0;
  }
}

export function getTetrominoKeys() {
  return Object.keys(TETROMINOES);
}

export function getRandomTetromino() {
  const keys = getTetrominoKeys();
  const randomIndex = Math.floor(Math.random() * keys.length);
  const type = keys[randomIndex];

  return new Tetromino(type);
}
