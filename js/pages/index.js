'use strict';
const qtdSquares = 9;
let arrSquares = [];
let arrShuffledIndexes = [];
let sort = true;
let idTimeOutAnimation = [];

const cntNr = document.querySelector('.js-cnt-nr');
createSquares();
cntNr.style.minHeight = `${65.5554 * qtdSquares}px`;
document.querySelectorAll('.js-shuffle').forEach((btn) => {
  btn.addEventListener('click', () => {
    sort = true;
    arrShuffledIndexes = [];
    shuffle();
    createSquares(true);
  });
});
document.querySelectorAll('.js-sort').forEach((btn) => {
  btn.addEventListener('click', () => {
    createSquares(false, !sort);
    sort = !sort;
  });
});

function shuffle() {
  const newRandomIndex = Math.floor(Math.random() * qtdSquares);
  arrShuffledIndexes.includes(newRandomIndex)
    ? shuffle()
    : arrShuffledIndexes.push(newRandomIndex);
  if (arrShuffledIndexes.length != arrSquares.length) {
    shuffle();
  }
}
function createSquares(shuffle = false, sortReverse = false) {
  arrSquares = [];
  for (let index = 1; index <= qtdSquares; index++) {
    const square = document.createElement('div');
    square.className = 'nr';
    square.innerText = shuffle ? arrShuffledIndexes[index - 1] : index;
    arrSquares.push(square);
  }
  if (sortReverse) {
    arrSquares.reverse();
  }
  printSquares(arrSquares);
}
function printSquares(squares) {
  cntNr.innerHTML = '';
  idTimeOutAnimation.forEach((id) => clearTimeout(id));
  squares.forEach((square, index) => {
    const id = setTimeout(() => {
      cntNr.appendChild(square);
    }, index * 60);
    idTimeOutAnimation.push(id);
  });
}