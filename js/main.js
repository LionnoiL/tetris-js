import * as t from "./tetrominoes.js";
import { GAME_STATUS, SPEED_LIMITS, fillArray, pause } from "./utils.js";

const CELL_SIZE = 40;
const LOOP_TICK = 10;
const SCORE_ONE_LINE = 100;
const SCORE_COMBO_RATIO = 2;

const playgroundDocument = document.querySelector(".playground");
const startBtnEl = document.querySelector(".button-start");
const nextPieceEl = document.querySelector(".next-piece");
const scoreEl = document.querySelector(".score-value");
const levelEl = document.querySelector(".level-value");

let mainLoopTimer;
let gameStatus = GAME_STATUS.stopped;
let nextFigure = t.getRandomTetromino();
let currentFigure = null;
let timePassed = 0;
let standartSpeed = 600; //за який час блок зсунеться вниз. чим меньше число, тим більше швидкість
let maxSpeed = 50;
let currentSpeed = standartSpeed;
let score = 0;
const playground = [];
let enableLoop = true;

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
  clearPosition(currentFigure);

  let canBeMoved = canMove(currentFigure, 0, 1);

  if (canBeMoved) {
    currentFigure.down();
  }

  drawPosition(currentFigure);
  renderPlayground();

  return canBeMoved;
}

function currentFigureLeft() {
  if (gameStatus === GAME_STATUS.running) {
    clearPosition(currentFigure);

    let canBeMoved = canMove(currentFigure, -1, 0);

    if (canBeMoved) {
      currentFigure.left();
    }
    drawPosition(currentFigure);
    renderPlayground();

    return true;
  } else {
    return false;
  }
}

function currentFigureRight() {
  if (gameStatus === GAME_STATUS.running) {
    clearPosition(currentFigure);

    let canBeMoved = canMove(currentFigure, 1, 0);

    if (canBeMoved) {
      currentFigure.right();
    }

    drawPosition(currentFigure);
    renderPlayground();

    return true;
  } else {
    return false;
  }
}

function currentFigureRotate() {
  if (gameStatus === GAME_STATUS.running) {
    clearPosition(currentFigure);
    currentFigure.rotate();
    drawPosition(currentFigure);
    renderPlayground();

    return true;
  } else {
    return false;
  }
}

function canMove(shape, deltaX, deltaY) {
  const x = shape.x + deltaX;
  const y = shape.y + deltaY;

  //дійшли до останнього рядка
  if (shape.bounds.yBound + deltaY >= playground.length) {
    return false;
  }

  //лівий край
  if (shape.bounds.lBound + deltaX < 0) {
    return false;
  }

  //правий край
  if (shape.bounds.rBound + deltaX > playground[0].length - 1) {
    return false;
  }

  const tData = shape.data;
  let canBeMoved = true;

  for (let i = 0; i < tData.length; i++) {
    const row = tData[i];
    for (let j = 0; j < row.length; j++) {
      let cell;
      try {
        cell = playground[y + i][x + j];
      } catch (error) {
        cell = false;
      }

      if (row[j] && cell) {
        canBeMoved = false;
      }
    }
  }

  return canBeMoved;
}

function clearPosition(shape) {
  const tData = shape.data;
  for (let i = 0; i < tData.length; i++) {
    const row = tData[i];
    const y = shape.y + i;
    const x = shape.x;
    for (let pIdx = 0; pIdx < row.length; pIdx++) {
      if (row[pIdx] && y >= 0 && y <= 19) {
        playground[y][x + pIdx] = null;
      }
    }
  }
}

function drawPosition(shape) {
  const tData = shape.data;
  for (let i = 0; i < tData.length; i++) {
    const row = tData[i];
    const y = shape.y + i;
    const x = shape.x;

    for (let pIdx = 0; pIdx < row.length; pIdx++) {
      if (row[pIdx] && y >= 0 && y <= 19) {
        playground[y][x + pIdx] = currentFigure;
      }
    }
  }
}

function checkLines() {
  const filledRows = [];
  for (let i = 0; i < playground.length; i++) {
    let notCompleteRow = false;
    for (let j = 0; j < playground[i].length; j++) {
      if (!playground[i][j]) {
        notCompleteRow = true;
        break;
      }
    }
    if (!notCompleteRow) {
      filledRows.push(i);
    }
  }

  clearLines(filledRows);
  changeScore(filledRows.length);
}

async function clearLines(filledRows) {
  if (filledRows.length > 0) {
    enableLoop = false;
    highlightLines(filledRows);
    await pause(500);
    filledRows.sort((a, b) => a - b);
    for (const i of filledRows) {
      for (let ip = i; ip > 0; ip--) {
        playground[ip] = playground[ip - 1].slice();
      }
      fillArray(playground[0], 0);
    }
    enableLoop = true;
  }
}

function highlightLines(filledRows) {
  for (const i of filledRows) {
    for (let j = 0; j < 10; j++) {
      const selector = `#cell_${i}_${j}`;
      const cellEl = document.querySelector(selector);
      cellEl.style.setProperty("--color1", "#928c8c");
    }
  }
}

function changeScore(linesCount) {
  if (linesCount > 0) {
    const ratio = linesCount > 1 ? SCORE_COMBO_RATIO : 1;
    score += linesCount * SCORE_ONE_LINE * ratio;
    scoreEl.textContent = score;
    changeSpeed();
  }
}

function changeSpeed() {
  currentSpeed = standartSpeed;
  let speed = currentSpeed;
  let level = 1;
  for (let i = 0; i < SPEED_LIMITS.length; i++) {
    if (score >= SPEED_LIMITS[i][0]) {
      speed = SPEED_LIMITS[i][1];
      level++;
    }
  }
  currentSpeed = speed;
  standartSpeed = currentSpeed;
  levelEl.textContent = level;
}

const startGame = () => {
  if (gameStatus === GAME_STATUS.running) {
    //ставим на паузу
    newGameStatus(GAME_STATUS.paused);
    return;
  }
  if (gameStatus === GAME_STATUS.paused) {
    //знімаємо з паузи
    newGameStatus(GAME_STATUS.running);
  } else {
    //старт гри
    newGameStatus(GAME_STATUS.running);
    currentFigure = nextFigure;
    generateNewTetromino();

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        currentFigureLeft();
      }
      if (event.key === "ArrowRight") {
        currentFigureRight();
      }
      if (event.key === "ArrowDown") {
        currentSpeed = maxSpeed;
      }
      if (event.key === "ArrowUp") {
        currentFigureRotate();
      }
    });

    document.addEventListener("keyup", (event) => {
      if (event.key === "ArrowDown") {
        currentSpeed = standartSpeed;
      }
    });
  }
};

const generateNewTetromino = () => {
  nextFigure = t.getRandomTetromino();
  renderTetromino(nextFigure);
  placeNext(nextFigure);
};

const loop = () => {
  if (enableLoop) {
    timePassed += LOOP_TICK;

    if (timePassed >= currentSpeed) {
      timePassed = 0;
      const figureMoved = currentFigureDown();

      if (figureMoved) {
        //
      } else {
        checkLines();
        currentFigure = nextFigure;
        generateNewTetromino();
      }
    }
  }
};

startBtnEl.addEventListener("click", startGame);
nextPieceEl.addEventListener("click", generateNewTetromino);

clearInterval(mainLoopTimer);
createPlayground();
