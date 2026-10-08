//* logic to crete gameboard and its functions *//

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

function createPlayer(name, mark) {
  return { name, mark };
}
