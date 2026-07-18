import * as t from "./tetrominoes.js";
import { GAME_STATUS } from "./utils.js";

const CELL_SIZE = 40;
const LOOP_TICK = 100;

const playgroundDocument = document.querySelector(".playground");
const startBtnEl = document.querySelector(".button-start");
const nextPieceEl = document.querySelector(".next-piece");

let mainLoopTimer;
let gameStatus = GAME_STATUS.stopped;
let nextFigure = t.getRandomTetromino();
let currentFigure = null;
let timePassed = 0;
let currentSpeed = 300; //за який час блок зсунеться вниз. чим меньше число, тим більше швидкість
const playground = [];

function createPlayground() {
  let playgroundText = "";

  for (let i = 0; i < 20; i++) {
    playgroundText += `<div class="row">`;
    playground[i] = [];
    for (let j = 0; j < 10; j++) {
      const id = `cell_${i}_${j}`;
      playgroundText += `<svg id="${id}" width="${CELL_SIZE}" height="${CELL_SIZE}"><use href="./images/sprites.svg#icon-grid-unit"></use></svg>`;
      playground[i][j] = null;
    }
    playgroundText += `</div>`;
  }

  playgroundDocument.innerHTML = playgroundText;
}

function renderTetromino(tetromino) {
  let res = "";
  const data = tetromino.data;
  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    for (let j = 0; j < row.length; j++) {
      const cellValue = row[j];
      const fillCell = cellValue != 1 ? "" : "fcell";
      res += `<div class="tcell x${j} y${i} ${fillCell}"></div>`;
    }
  }

  tetromino.html = res;
}

function renderPlayground() {
  for (let i = 0; i < playground.length; i++) {
    const row = playground[i];

    for (let j = 0; j < row.length; j++) {
      const selector = `#cell_${i}_${j}`;
      const cellEl = document.querySelector(selector);
      if (row[j]) {
        cellEl.style.setProperty("--color1", row[j].color);
      } else {
        cellEl.style.setProperty("--color1", "#e8f5f9");
      }
    }
  }
}

function placeNext(tetromino) {
  const placeEl = document.querySelector(".tetromino-wrapper");
  placeEl.innerHTML = tetromino.html;
  placeEl.style.width = CELL_SIZE * tetromino.data.length + "px";
  placeEl.style.height = CELL_SIZE * tetromino.data[0].length + "px";

  const cells = placeEl.querySelectorAll(".fcell");
  cells.forEach((element) => {
    element.style.backgroundColor = tetromino.color;
  });
}

function newGameStatus(newStatus) {
  gameStatus = newStatus;
  if (gameStatus === GAME_STATUS.running) {
    startBtnEl.textContent = "Pause";
    mainLoopTimer = window.setInterval(loop, LOOP_TICK);
  } else {
    startBtnEl.textContent = "Play";
    clearInterval(mainLoopTimer);
  }
}

function currentFigureDown() {
  const y = currentFigure.y + 1;

  //дійшли до останнього рядка
  if (y >= playground.length + 2) {
    return false;
  }

  const tData = currentFigure.data;
  const lastRow = tData[tData.length - 1];
  const newPosition = playground[y];

  let canBeMoved = true;

  //зустріли перешкоду
  for (let pIdx = 0; pIdx < lastRow.length; pIdx++) {
    if (lastRow[pIdx] && !newPosition[currentFigure.x + pIdx]) {
      canBeMoved = false;
    }
  }

  if (canBeMoved) {
    //зсув тетроміно на один рядок вниз

    clearPosition(currentFigure);
    currentFigure.y = y;
    drawPosition(currentFigure);

    renderPlayground();
  }

  return canBeMoved;
}

function clearPosition(shape) {
  const tData = shape.data;
  for (let i = 0; i < tData.length; i++) {
    const row = tData[i];
    const delta = tData.length - i;
    const x = shape.x;
    const y = shape.y - delta;
    for (let pIdx = 0; pIdx < row.length; pIdx++) {
      if (y >= 0) {
        playground[y][x + pIdx] = null;
      }
    }
  }
}

function drawPosition(shape) {
  const tData = shape.data;
  for (let i = 0; i < tData.length; i++) {
    const row = tData[i];
    const delta = tData.length - i;
    const x = shape.x;
    const y = shape.y - delta;

    for (let pIdx = 0; pIdx < row.length; pIdx++) {
      if (row[pIdx] && y >= 0) {
        playground[y][x + pIdx] = currentFigure;
      }
    }
  }
}

function checkLines() {}

const startGame = () => {
  if (gameStatus === GAME_STATUS.running) {
    newGameStatus(GAME_STATUS.paused);
    return;
  } else {
    newGameStatus(GAME_STATUS.running);
    createPlayground();
  }

  currentFigure = nextFigure;
  generateNewTetromino();
};

const generateNewTetromino = () => {
  nextFigure = t.getRandomTetromino();
  renderTetromino(nextFigure);
  placeNext(nextFigure);
};

const loop = () => {
  timePassed += LOOP_TICK;

  if (timePassed >= currentSpeed) {
    timePassed = 0;
    const figureMoved = currentFigureDown();
    checkLines();
    if (figureMoved) {
    }
  }
};

startBtnEl.addEventListener("click", startGame);
nextPieceEl.addEventListener("click", generateNewTetromino);

clearInterval(mainLoopTimer);
createPlayground();
