import React, { useState } from 'react';
import MinesweeperGame from './GameLogic';
import Login from './Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      {user ? (
        <MinesweeperGame user={user} />
      ) : (
        <Login onLogin={setUser} />
      )}
    </div>
  );
}

export default App;