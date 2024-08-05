import React from 'react';
import Cell from './Cell';

const Board = ({ board, onCellClick, onCellRightClick }) => {
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <div className="board" onContextMenu={handleContextMenu}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              onClick={() => onCellClick(rowIndex, colIndex)}
              onContextMenu={(e) => {
                e.preventDefault();
                onCellRightClick(rowIndex, colIndex);
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;