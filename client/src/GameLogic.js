import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board';

const BOARD_SIZE = 10;
const NUM_MINES = 15;

const MinesweeperGame = () => {
  const [board, setBoard] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'

  const createBoard = useCallback(() => {
    const newBoard = Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    );

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < NUM_MINES) {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (
                row + i >= 0 &&
                row + i < BOARD_SIZE &&
                col + j >= 0 &&
                col + j < BOARD_SIZE &&
                newBoard[row + i][col + j].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[row][col].neighborMines = count;
        }
      }
    }

    return newBoard;
  }, []);

  useEffect(() => {
    setBoard(createBoard());
  }, [createBoard]);

  const revealCell = useCallback((row, col) => {
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE || board[row][col].isRevealed || board[row][col].isFlagged) {
      return;
    }

    const newBoard = [...board];
    newBoard[row][col].isRevealed = true;

    if (newBoard[row][col].neighborMines === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          revealCell(row + i, col + j);
        }
      }
    }

    setBoard(newBoard);
  }, [board]);

  const toggleFlag = useCallback((row, col) => {
    if (gameStatus !== 'playing' || board[row][col].isRevealed) return;

    const newBoard = [...board];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
  }, [board, gameStatus]);

  const checkWin = useCallback(() => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!board[row][col].isMine && !board[row][col].isRevealed) {
          return false;
        }
      }
    }
    return true;
  }, [board]);

  const handleCellClick = useCallback((row, col) => {
    if (gameStatus !== 'playing') return;

    if (board[row][col].isFlagged) return;

    if (board[row][col].isMine) {
      setGameStatus('lost');
      // Reveal all mines
      const newBoard = board.map(row =>
        row.map(cell =>
          cell.isMine ? { ...cell, isRevealed: true } : cell
        )
      );
      setBoard(newBoard);
    } else {
      revealCell(row, col);
      if (checkWin()) {
        setGameStatus('won');
      }
    }
  }, [board, gameStatus, revealCell, checkWin]);

  const resetGame = () => {
    setBoard(createBoard());
    setGameStatus('playing');
  };

  return (
    <div className="minesweeper-game">
      <h1>Minesweeper</h1>
      <Board 
        board={board} 
        onCellClick={handleCellClick} 
        onCellRightClick={toggleFlag}
      />
      <div className="game-status">
        {gameStatus === 'won' && <p>Congratulations! You won!</p>}
        {gameStatus === 'lost' && <p>Game Over! You hit a mine.</p>}
      </div>
      <button onClick={resetGame}>New Game</button>
    </div>
  );
};

export default MinesweeperGame;