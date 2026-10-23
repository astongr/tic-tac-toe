//* logic to create gameboard and its functions *//

const Gameboard = (function () {
  const myBoard = ["", "", "", "", "", "", "", "", ""];

  return {
    getBoard: function () {
      return [...myBoard];
    },
    resetBoard: function () {
      myBoard.fill("");
    },
    placeMark: function (index, mark) {
      if (myBoard[index] === "") {
        myBoard[index] = mark;
        return true;
      } else {
        return false;
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
  const STATUS = { WIN: "win", DRAW: "draw", IN_PLAY: "in-play" };
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

  function getGameStatus() {
    const board = Gameboard.getBoard();
    if (checkWin()) return STATUS.WIN;
    if (!board.includes("")) return STATUS.DRAW;
    return STATUS.IN_PLAY;
  }

  return {
    playRound: function (index) {
      if (gameOver) {
        return { status: getGameStatus(), player: currentPlayer };
      }
      const moveLanded = Gameboard.placeMark(index, currentPlayer.mark);
      if (!moveLanded) {
        return { status: STATUS.IN_PLAY, player: currentPlayer };
      }

      const status = getGameStatus();
      switch (status) {
        case STATUS.WIN:
          gameOver = true;
          return { status: STATUS.WIN, player: currentPlayer };

        case STATUS.DRAW:
          gameOver = true;
          return { status: STATUS.DRAW, player: currentPlayer };

        case STATUS.IN_PLAY:
          currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
          return { status: STATUS.IN_PLAY, player: currentPlayer };

        default:
          console.error(`Unexpected game status: ${status}`);
      }
    },

    resetGame: function () {
      Gameboard.resetBoard();
      gameOver = false;
      currentPlayer = playerOne;
    },

    getCurrentPlayer: function () {
      return currentPlayer;
    },
  };
})();

const displayController = (function () {
  const gameboard = document.getElementById("gameboard");
  const statusDisplay = document.getElementById("status");
  const restartButton = document.getElementById("restart-btn");

  const board = Gameboard.getBoard();
  for (let i = 0; i < board.length; i++) {
    const cell = document.createElement("button");
    cell.dataset.index = i;
    gameboard.appendChild(cell);
  }

  function render() {
    const board = Gameboard.getBoard();
    for (let i = 0; i < board.length; i++) {
      const cell = gameboard.querySelector(`[data-index="${i}"]`);
      cell.textContent = board[i];
    }
  }

  function showTurn() {
    const currentPlayer = gameController.getCurrentPlayer();
    statusDisplay.textContent = `${currentPlayer.name}'s turn!`;
  }
  render();
  showTurn();

  restartButton.addEventListener("click", function () {
    gameController.resetGame();
    render();
    showTurn();
  });

  gameboard.addEventListener("click", function (e) {
    if (!e.target.matches("button")) return;
    const clickedCell = e.target;
    const index = Number(clickedCell.dataset.index);
    const result = gameController.playRound(index);
    render();

    switch (result.status) {
      case "in-play":
        showTurn();
        break;

      case "win":
        statusDisplay.textContent = `${result.player.name} wins! Click Restart to play again.`;
        break;

      case "draw":
        statusDisplay.textContent =
          "The game is a draw! Click Restart to play again.";
        break;
    }
  });
  return { render };
})();
