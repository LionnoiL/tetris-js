import * as t from "./tetrominoes.js";
import { GAME_STATUS, SPEED_LIMITS, SOUNDS } from "./config.js";
import { fillArray, pause, playSound } from "./utils.js";

const EMPTY_CELL_COLOR = "#e8f5f9";
const HIGHLIGHT_COLOR = "#928c8c";
const PLAYGROUND_WIDTH = 10;
const PLAYGROUND_HEIGHT = 20;
const CELL_SIZE = 40;
const LOOP_TICK = 10;
const SCORE_ONE_LINE = 100;
const SCORE_COMBO_RATIO = 2;

const getEndGameMessage = (score) =>
  `Great job! You scored ${score} points. Want to try again and beat your high score?`;

const playgroundDocument = document.querySelector(".playground");
const startBtnEl = document.querySelector(".start-btn");
const nextPieceEl = document.querySelector(".next-piece");
const scoreEl = document.querySelector(".score-value");
const levelEl = document.querySelector(".level-value");

const messageWrapperBtnEl = document.querySelector(".message-wrapper");
const messageTextBtnEl = document.querySelector(".messge-text");
const closeMessageBtnEl = document.querySelector(".close-btn");

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
  for (let i = 0; i < PLAYGROUND_HEIGHT; i++) {
    playground[i] = new Array(PLAYGROUND_WIDTH).fill(null);
  }

  playgroundDocument.innerHTML = playground
    .map(
      (row, i) =>
        `<div class="row">${row
          .map(
            (element, j) =>
              `<svg id="cell_${i}_${j}" width="${CELL_SIZE}" height="${CELL_SIZE}"><use href="./images/sprites.svg#icon-grid-unit"></use></svg>`,
          )
          .join("")}</div>`,
    )
    .join("");
}

function renderTetromino(tetromino) {
  const { data } = tetromino;

  tetromino.html = data
    .map((row, i) =>
      row
        .map((cellValue, j) => {
          const fillCell = cellValue != 1 ? "" : "fcell";
          return `<div class="tcell x${j} y${i} ${fillCell}"></div>`;
        })
        .join(""),
    )
    .join("");
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
        cellEl.style.setProperty("--color1", EMPTY_CELL_COLOR);
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
  let startBtnText = "Play";
  if (gameStatus === GAME_STATUS.running) {
    startBtnText = "Pause";
    mainLoopTimer = window.setInterval(loop, LOOP_TICK);
  } else if (gameStatus === GAME_STATUS.stopped) {
    fillArray(playground, null);
    score = 0;
    scoreEl.textContent = score;
    changeSpeed();
    currentSpeed = standartSpeed;
    renderPlayground();
  } else {
    clearInterval(mainLoopTimer);
  }

  startBtnEl.textContent = startBtnText;
}

function cloneTetrominoData(data) {
  return data.map((row) => [...row]);
}

function moveCurrentFigure(action, dx = 0, dy = 0) {
  if (gameStatus !== GAME_STATUS.running) {
    return false;
  }

  const isRotate = action === "rotate";

  if (isRotate) {
    clearPosition(currentFigure);
    const canBeMoved = t.tryRotateTetromino(
      currentFigure,
      (shape, shapeDx, shapeDy) => canMove(shape, shapeDx, shapeDy),
    );

    drawPosition(currentFigure);
    renderPlayground();

    return canBeMoved;
  }

  clearPosition(currentFigure);

  const canBeMoved = canMove(currentFigure, dx, dy);

  if (canBeMoved) {
    currentFigure[action]();
  }

  drawPosition(currentFigure);
  renderPlayground();

  return canBeMoved;
}

function currentFigureDown() {
  return moveCurrentFigure("down", 0, 1);
}

function currentFigureLeft() {
  return moveCurrentFigure("left", -1, 0);
}

function currentFigureRight() {
  return moveCurrentFigure("right", 1, 0);
}

function currentFigureRotate() {
  return moveCurrentFigure("rotate");
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
    await pause(200);
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
    for (let j = 0; j < PLAYGROUND_WIDTH; j++) {
      const selector = `#cell_${i}_${j}`;
      const cellEl = document.querySelector(selector);
      cellEl.style.setProperty("--color1", HIGHLIGHT_COLOR);
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

function eventKeyDown(event) {
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
}

function eventKeyUp(event) {
  if (event.key === "ArrowDown") {
    currentSpeed = standartSpeed;
  }
}

function startGame() {
  if (gameStatus === GAME_STATUS.running) {
    newGameStatus(GAME_STATUS.paused);
    return;
  }
  if (gameStatus === GAME_STATUS.paused) {
    newGameStatus(GAME_STATUS.running);
  } else {
    newGameStatus(GAME_STATUS.running);
    currentFigure = nextFigure;
    generateNewTetromino();

    document.addEventListener("keydown", eventKeyDown);
    document.addEventListener("keyup", eventKeyUp);
  }
}

function endGame() {
  clearInterval(mainLoopTimer);

  document.removeEventListener("keydown", eventKeyDown);
  document.removeEventListener("keyup", eventKeyUp);

  openMessage(getEndGameMessage(score));
}

function finishGame() {
  newGameStatus(GAME_STATUS.stopped);
}

function generateNewTetromino() {
  nextFigure = t.getRandomTetromino();
  renderTetromino(nextFigure);
  placeNext(nextFigure);
}

function loop() {
  if (enableLoop) {
    timePassed += LOOP_TICK;

    if (timePassed >= currentSpeed) {
      timePassed = 0;
      const figureMoved = currentFigureDown();

      if (figureMoved) {
        //
      } else {
        playSound(SOUNDS.drop);
        checkLines();
        if (currentFigure.y === -1) {
          endGame();
        }
        currentFigure = nextFigure;
        generateNewTetromino();
      }
    }
  }
}

function openMessage(message) {
  messageTextBtnEl.textContent = message;
  messageWrapperBtnEl.classList.add("active");
}

function closeMessage() {
  messageWrapperBtnEl.classList.remove("active");
  finishGame();
}

startBtnEl.addEventListener("click", startGame);
closeMessageBtnEl.addEventListener("click", closeMessage);
nextPieceEl.addEventListener("click", generateNewTetromino);

clearInterval(mainLoopTimer);
createPlayground();
