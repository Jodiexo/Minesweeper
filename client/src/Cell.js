import React from 'react';
import './Cell.css';

const Cell = ({ value, onClick, onContextMenu }) => {
  let cellContent = '';
  let className = 'cell';

  if (value.isRevealed) {
    className += ' revealed';
    if (value.isMine) {
      cellContent = '💣';
    } else if (value.neighborMines > 0) {
      cellContent = value.neighborMines;
    }
  } else if (value.isFlagged) {
    cellContent = '🚩';
  }

  return (
    <button 
      className={className}
      onClick={onClick}
      onContextMenu={onContextMenu}
      disabled={value.isRevealed}
    >
      {cellContent}
    </button>
  );
};

export default Cell;