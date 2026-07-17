import * as t from "./tetrominoes.js";

const CELL_SIZE = 40;

function createPlayground() {
  const playgroundDocument = document.querySelector(".playground");
  let playgroundText = "";

  for (let i = 0; i < 20; i++) {
    playgroundText += `<div class="row">`;
    for (let j = 0; j < 10; j++) {
      playgroundText += `<svg width="${CELL_SIZE}" height="${CELL_SIZE}"><use href="./images/sprites.svg#icon-grid-unit"></use></svg>`;
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

const startGame = () => {
  console.log("start");
};

const startBtnEl = document.querySelector(".button-start");
startBtnEl.addEventListener("click", startGame);

createPlayground();

const nextFigure = t.getRandomTetromino();

renderTetromino(nextFigure);

placeNext(nextFigure);
