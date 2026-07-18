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
  down() {
    this.y += 1;
    this.#setBounds();
  }

  left() {
    this.x -= 1;
    this.#setBounds();
  }

  right() {
    this.x += 1;
    this.#setBounds();
  }

  #getLastRowIndex() {
    let lastIndex = -1;
    for (let i = 0; i < this.data.length; i++) {
      const row = this.data[i];
      for (let j = 0; j < row.length; j++) {
        if (row[j]) {
          lastIndex = i;
        }
      }
    }
    return lastIndex;
  }

  #setBounds() {
    let minL = 100;
    let maxL = -1;
    let maxY = -1;

    for (let i = 0; i < this.data.length; i++) {
      const row = this.data[i];
      for (let j = 0; j < row.length; j++) {
        if (row[j]) {
          if (j < minL) minL = j;
          if (j > maxL) maxL = j;
          maxY = this.data.length - i;
        }
      }
    }
    this.bounds.lBound = this.x + minL;
    this.bounds.rBound = this.x + maxL;
    this.bounds.yBound = this.y - maxY;
  }

  constructor(type) {
    this.type = type;
    this.data = TETROMINOES[type];
    this.color = COLORS[type];
    this.x = Math.round((10 - this.data[0].length) / 2) - 1;
    this.y = -1;
    this.lastRowIndex = this.#getLastRowIndex();
    this.lastRow = this.data[this.lastRowIndex];
    this.bounds = {};
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
