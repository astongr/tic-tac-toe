//* logic to create gameboard and its functions *//

const Gameboard = (function () {
  const myBoard = ["", "", "", "", "", "", "", "", ""];

  return {
    getBoard: function () {
      return myBoard;
    },
    resetBoard: function () {
      myBoard.fill("");
    },
    placeMark: function (index, mark) {
      if (myBoard[index] === "") {
        myBoard[index] = mark;
      } else {
        console.log("Sorry, that place on the grid is taken! Choose another.");
      }
    },
  };
})();

//* Factory function for creating players *//
function createPlayer(name, mark) {
  return { name, mark };
}

const gameController = (function () {
  const playerOne = createPlayer("Player One", "X");
  const playerTwo = createPlayer("Player Two", "O");
  let currentPlayer = playerOne;
  let gameOver = false;
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function checkWin() {
    const board = Gameboard.getBoard();
    for (let i = 0; i < winningLines.length; i++) {
      const line = winningLines[i];
      if (
        board[line[0]] !== "" &&
        board[line[0]] === board[line[1]] &&
        board[line[1]] === board[line[2]]
      ) {
        return true;
      }
    }
    return false;
  }

  function checkTie() {
    const board = Gameboard.getBoard();
    return !board.includes("") && !checkWin();
  }

  return {
    playRound: function (index) {
      if (gameOver) {
        console.log("Game is over - start a new game!");
        return;
      }
      Gameboard.placeMark(index, currentPlayer.mark);
      if (checkWin()) {
        console.log(`${currentPlayer.name} Wins!`);
        gameOver = true;
        return;
      }

      if (checkTie()) {
        console.log("The game is a Draw!");
        gameOver = true;
        return;
      }
      currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    },
    resetGame: function () {
      Gameboard.resetBoard();
      gameOver = false;
      currentPlayer = playerOne;
    },
  };
})();
