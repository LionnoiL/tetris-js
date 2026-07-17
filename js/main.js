import * as t from "./tetrominoes.js";

function createPlayground() {
  const playgroundDocument = document.querySelector(".playground");
  let playgroundText = "";

  for (let i = 0; i < 20; i++) {
    playgroundText += '<div class="row">';
    for (let j = 0; j < 10; j++) {
      playgroundText +=
        '<svg width="40" height="40"><use href="./images/sprites.svg#icon-grid-unit"></use></svg>';
    }
    playgroundText += "</div>";
  }

  playgroundDocument.innerHTML = playgroundText;
}

function renderTetromino(tetromino) {
  console.log(tetromino);
}

const startGame = () => {
  console.log("start");
};

const startBtnEl = document.querySelector(".button-start");
startBtnEl.addEventListener("click", startGame);

createPlayground();

console.log(t.getTetrominoKeys());

renderTetromino(t.getRandomTetromino());
