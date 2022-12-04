/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const divMessage = document.querySelector("#divMessage");
divMessage.innerHTML = "";
const resetBtn = document.querySelector("#resetBtn");
const formSubmit = document.querySelector("#from_submit");
const divPlayersEntries = document.querySelector("#divPlayersEntries");
const game = document.querySelector("#game");

const divLegendPlayer1 = document.querySelector("#divLegendPlayer1");
const divLegendPlayer2 = document.querySelector("#divLegendPlayer2");

resetBtn.addEventListener("click", () => {
  window.location.reload();
});

formSubmit.addEventListener("submit", (e) => {
  e.preventDefault();
  const color1 = document.getElementById('player-1').value.toString().trim().toLowerCase();
  const color2 = document.getElementById('player-2').value.toString().trim().toLowerCase();
  const player1 = new Player(color1);
  const player2 = new Player(color2);

  if (!isColor(color1)) {
    alert("Player 1 color picked up is not a valid color!");
    return;
  }
  if (!isColor(color2)) {
    alert("Player 2 color picked up is not a valid color!");
    return;
  }
  if (color1 === color2) {
    alert("Player 1 and player 2 are the same color please change it!");
    return;
  }
  if (color1 === "black" || color1 === "white" || color2 === "black" || color2 === "white") {
    alert("The black and white color is perhaps not chosen!");
    return;
  }

  divLegendPlayer1.classList.add('divLegend');
  divLegendPlayer2.classList.add('divLegend');
  divLegendPlayer1.style.backgroundColor = color1;
  divLegendPlayer2.style.backgroundColor = color2;


  new Game(player1, player2);
  divPlayersEntries.classList.add('hidden');
  game.classList.remove('hidden');
  formSubmit.reset();

});
// check if the sting value is a valable color value

const isColor = (colorString) => {
  if (colorString.includes("#")){
    const reg=/^#([0-9a-f]{3}){1,2}$/i;
    return reg.test(colorString);
  }
  let string = new Option().style;
  string.color = colorString;
  return string.color === colorString;
}

class Player {
  constructor(color) {
    this.color = color;
  }
}
class Game {
  constructor(p1, p2, HEIGHT = 6, WIDTH = 7) {
    this.players = [p1, p2];
    this.HEIGHT = HEIGHT;//Rows
    this.WIDTH = WIDTH;//Columns
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }
  /** makeBoard: create in-JS board structure:
  *    board = array of rows, each row is array of cells  (board[y][x])
  */

  makeBoard() {
    // TODO: set "board" to empty HEIGHT x WIDTH matrix array
    this.board = [];

    for (let y = 0; y < this.HEIGHT /*Rows*/; y++) {
      const newRow = []; // Initialization for each row
      for (let x = 0; x < this.WIDTH /*Columns*/; x++) {
        newRow.push(''); //Adding 'x' number of empty colums to each row to generate the matrix
      }
      this.board.push(newRow);
    }
  }


  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
    const htmlBoard = document.querySelector("#board");

    // TODO: add comment for this code
    //this bloc of code generate the head row of the board 'column-top'. 
    const top = document.createElement("tr"); // Creation of the first head row  'column-top' 
    top.setAttribute("id", "column-top");// Adding 'id' to the first head row 'column-top'

    //top.addEventListener("click", this.handleClick); // Adding click event listener to the first head row 'column-top'
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH /*Columns*/; x++) { // making a loop through columns
      const headCell = document.createElement("td");// Creation of new 'td'(Cell) for each column to the first head row 
      headCell.setAttribute("id", x); //Adding 'id' of new td for each column to the first head row 
      headCell.innerHTML = "&#10010;";

      top.append(headCell);// Adding new 'td'(Cell) to the first head row
    }
    htmlBoard.append(top);// Adding cell to board(table);


    // TODO: add comment for this code
    //in this section the all game cells to the board base on the number of Rows and Columns with two loop.
    for (let y = 0; y < this.HEIGHT/*Rows*/; y++) {
      const row = document.createElement("tr");
      for (let x = 0; x < this.WIDTH/*Columns*/; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);// Adding 'id' to each cell. Rows indicices are row=[0,1,2,3,4,5,6] and col=[0,1,2,3,4,5] => ${y}-${x} => "0-0", "0-1", "0-2" etc.
        row.append(cell); //Adding cell to the row
      }

      htmlBoard.append(row); // Adding row to the board;

    }
  }


  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    // TODO: write the real version of this, rather than always returning 0

    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) return y;// checking if this cell is empty and if so return the index 
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    // TODO: make a div and insert into correct table cell

    if (!this.gameOver) {// Checking before placing piece into the board.
      const piece = document.createElement('div');
      piece.classList.add('piece');
      //piece.classList.add(`player-${this.currPlayer}`);
      piece.style.backgroundColor = this.currPlayer.color;
      //this.currPlayer.color
      const place = document.getElementById(`${y}-${x}`);
      place.append(piece);
    }

  }

  /** endGame: announce game end */

  endGame(msg) {
    // TODO: pop up alert message
    setTimeout(() => {
      divMessage.innerHTML = msg;
      resetBtn.classList.remove('hidden');
      alert(msg);
    }, 200);

  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    let x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    // TODO: add line to update in-memory board

    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);


    /** checkForWin: check board cell-by-cell for "does a win start here?" */
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer === this.players[0] ? 1 : 2} won!`);
    }

    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('The game is a draw!');
    }

    // switch players
    // TODO: switch currPlayer 1 <-> 2

    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];

  }
  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }

    // TODO: read and understand this code. Add comments to help you.

    //This function check the four possibilities to win the game in four cases:
    //horizontal got 4 pieces with the same color 
    //vertical got 4 pieces with the same color 
    //diagonal right got 4 pieces with the same color 
    //diagonal left 4 pieces with the same color 
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          this.gameOver = true;
          return true;
        }
      }
    }
  }
}
