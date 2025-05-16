let currentPlayer = "O";
function checkWinner() {
  const cells = document.querySelectorAll(".cell");
  const combos = [
    [0,1,2], [3,4,5], [6,7,8], 
    [0,3,6], [1,4,7], [2,5,8], 
    [0,4,8], [2,4,6]
  ];

  for (let combo of combos) {
    const [a, b, c] = combo;
    if (
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent
    ) {
      return cells[a].textContent;
    }
  }
  return null;
}
let gameOver = false;

document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("click", function() {
    if (cell.textContent === "" && !gameOver) {
    cell.textContent = currentPlayer;
    const winner = checkWinner();
    if (winner) {
        alert(`Wygrał ${winner}!`);
        gameOver = true;
    } else {
        currentPlayer = currentPlayer === "O" ? "X" : "O";
    }
    }
});
});