import React, { useState } from 'react';
import { createBoard, revealCell } from './GameLogic';

const Board = () => {
  const [board, setBoard] = useState(createBoard());
  
  const handleClick = (x, y) => {
    const newBoard = [...board];
    revealCell(newBoard, x, y);
    setBoard(newBoard);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${board.length}, 30px)` }}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            onClick={() => handleClick(rowIndex, colIndex)}
            style={{
              width: '30px',
              height: '30px',
              border: '1px solid black',
              backgroundColor: cell.wasClicked ? (cell.isBomb ? 'red' : 'lightgray') : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {cell.wasClicked && !cell.isBomb ? cell.adjacentBombCount || '' : ''}
          </div>
        ))
      )}
    </div>
  );
};

export default Board;