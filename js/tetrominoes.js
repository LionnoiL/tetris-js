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
  I: "#31C7EF",
  O: "#F7D308",
  T: "#AD4D9C",
  S: "#42B642",
  Z: "#EF2029",
  J: "#5A65AD",
  L: "#EF7921",
};

export class Tetromino {
  constructor(type) {
    this.type = type;
    this.data = TETROMINOES[type];
    this.color = COLORS[type];
    this.x = Math.round((10 - this.data[0].length) / 2) - 1;
    this.y = -1;
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
