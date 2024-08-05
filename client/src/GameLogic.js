import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import { API_URL } from './Config';


const DIFFICULTIES = {
  easy: { size: 10, mines: 10 },
  medium: { size: 16, mines: 40 },
  hard: { size: 20, mines: 80 }
};

const MinesweeperGame = ({ user }) => {
  const [difficulty, setDifficulty] = useState('easy');
  const [board, setBoard] = useState([]);
  const [gameStatus, setGameStatus] = useState('ready'); // 'ready', 'playing', 'won', 'lost'
    const [timer, setTimer] = useState(0);
     const [topTime, setTopTime] = useState(null);
   const [recentGames, setRecentGames] = useState([]);
    
    
 useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/${user.username}}`);
      const data = await response.json();
      if (data.top_time) {
        setTopTime(data.top_time);
        setDifficulty(data.difficulty);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
    const updateUserData = async (newTopTime) => {
    try {
      await fetch(`http://localhost:3000/api/users/${user.username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ top_time: newTopTime, difficulty }),
      });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const createBoard = useCallback(() => {
    const { size, mines } = DIFFICULTIES[difficulty];
    const newBoard = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    );

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (
                row + i >= 0 &&
                row + i < size &&
                col + j >= 0 &&
                col + j < size &&
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
  }, [difficulty]);

  useEffect(() => {
    setBoard(createBoard());
  }, [createBoard]);

  useEffect(() => {
    let interval;
    if (gameStatus === 'playing') {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStatus]);

  const revealCell = useCallback((row, col) => {
    const { size } = DIFFICULTIES[difficulty];
    if (row < 0 || row >= size || col < 0 || col >= size || board[row][col].isRevealed || board[row][col].isFlagged) {
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
  }, [board, difficulty]);

  const toggleFlag = useCallback((row, col) => {
    if (gameStatus !== 'playing' || board[row][col].isRevealed) return;

    const newBoard = [...board];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
  }, [board, gameStatus]);

  const checkWin = useCallback(() => {
    const { size, mines } = DIFFICULTIES[difficulty];
    let revealedCount = 0;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!board[row][col].isMine && board[row][col].isRevealed) {
          revealedCount++;
        }
      }
    }
    return revealedCount === size * size - mines;
  }, [board, difficulty]);

  const handleCellClick = useCallback((row, col) => {
    if (gameStatus === 'ready') {
      setGameStatus('playing');
    }
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
        const newRecentGames = [
          { difficulty, time: timer },
          ...recentGames.slice(0, 9)
        ];
        setRecentGames(newRecentGames);
      }
    }
  }, [board, gameStatus, revealCell, checkWin, difficulty, timer, recentGames]);

  const resetGame = () => {
    setBoard(createBoard());
    setGameStatus('ready');
    setTimer(0);
  };

  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
    resetGame();
  };

  return (
    <div className="minesweeper-game">
          <h1>Minesweeper</h1>
           <div className="user-info">
        <p>Welcome, {user.username}!</p>
        <p>Top Time: {topTime ? `${topTime} seconds` : 'N/A'}</p>
      </div>
      <div className="controls">
        <select value={difficulty} onChange={(e) => changeDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button onClick={resetGame}>New Game</button>
        <div className="timer">Time: {timer} seconds</div>
      </div>
      <Board 
        board={board} 
        onCellClick={handleCellClick} 
        onCellRightClick={toggleFlag}
      />
      <div className="game-status">
        {gameStatus === 'won' && <p>Congratulations! You won!</p>}
        {gameStatus === 'lost' && <p>Game Over! You hit a mine.</p>}
      </div>
      <div className="recent-games">
        <h2>Recent Games</h2>
        <ul>
          {recentGames.map((game, index) => (
            <li key={index}>
              {game.difficulty} - {game.time} seconds
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MinesweeperGame;