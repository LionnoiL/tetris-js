import * as t from "./tetrominoes.js";
import { GAME_STATUS } from "./utils.js";

const CELL_SIZE = 40;

const startBtnEl = document.querySelector(".button-start");
const nextPieceEl = document.querySelector(".next-piece");

let mainLoopTimer;
let gameStatus = GAME_STATUS.stopped;
let nextFigure = t.getRandomTetromino();
let currentFigure = null;
const playground = [];

function createPlayground() {
  const playgroundDocument = document.querySelector(".playground");
  let playgroundText = "";

  for (let i = 0; i < 20; i++) {
    playgroundText += `<div class="row">`;
    playground[i] = [];
    for (let j = 0; j < 10; j++) {
      playgroundText += `<svg width="${CELL_SIZE}" height="${CELL_SIZE}"><use href="./images/sprites.svg#icon-grid-unit"></use></svg>`;
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
    mainLoopTimer = window.setInterval(loop, 500);
  } else {
    startBtnEl.textContent = "Play";
    clearInterval(mainLoopTimer);
  }
}

const startGame = () => {
  if (gameStatus === GAME_STATUS.running) {
    newGameStatus(GAME_STATUS.paused);
    return;
  } else {
    newGameStatus(GAME_STATUS.running);
  }

  currentFigure = nextFigure;
  generateNewTetromino();
};

const generateNewTetromino = () => {
  nextFigure = t.getRandomTetromino();
  renderTetromino(nextFigure);
  placeNext(nextFigure);
};

const loop = () => {};

startBtnEl.addEventListener("click", startGame);
nextPieceEl.addEventListener("click", generateNewTetromino);

clearInterval(mainLoopTimer);
createPlayground();
