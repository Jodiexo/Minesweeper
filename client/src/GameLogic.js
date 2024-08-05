export const createBoard = (size = 10, mineCount = 10) => {
  const board = Array(size).fill(null).map(() => Array(size).fill(null).map(() => ({
    isBomb: false,
    adjacentBombCount: 0,
    wasClicked: false,
  })));

  // Place mines
  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);

    if (!board[x][y].isBomb) {
      board[x][y].isBomb = true;
      minesPlaced++;

      // Update adjacent cells
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newX = x + i;
          const newY = y + j;
          if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
            board[newX][newY].adjacentBombCount++;
          }
        }
      }
    }
  }

  return board;
};

export const revealCell = (board, x, y) => {
    if (x < 0 || x >= board.length || y < 0 || y >= board[0].length || board[x][y].wasClicked) {
        return;
    }

    board[x][y].wasClicked = true;

    if (board[x][y].isBomb) {
        return; // End game logic can be added here
    }

    if (board[x][y].adjacentBombCount === 0) {
        // Recursively reveal adjacent cells
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i !== 0 || j !== 0) {
                    revealCell(board, x + i, y + j);
                }
            }
        }
    }
}