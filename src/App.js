import { useState } from 'react';

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button 
      className={`relative w-16 h-16 sm:w-20 sm:h-20 text-3xl sm:text-4xl font-bold rounded-lg
        transition-all duration-200 border-4 
        ${isWinning 
          ? 'bg-lime-500 border-lime-300 shadow-[0_0_25px_#84cc16] animate-pulse' 
          : value 
            ? 'bg-purple-900 border-purple-400 shadow-[0_0_15px_#c084fc]'
            : 'bg-gray-900 border-cyan-400 shadow-[0_0_12px_#22d3ee] hover:bg-gray-800 hover:shadow-[0_0_25px_#22d3ee] hover:scale-105 cursor-pointer active:scale-95'
        }`}
      onClick={onSquareClick}
      disabled={value !== null}
      style={{ fontFamily: "'Press Start 2P', cursive" }}
    >
      {value && (
        <span className={`${value === 'X' ? 'text-cyan-300' : 'text-pink-400'} 
          drop-shadow-[0_0_8px_currentColor]`}>
          {value}
        </span>
      )}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winningLine }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  let statusColor = 'text-cyan-300';
  
  if (winner) {
    status = 'WINNER: ' + winner.winner;
    statusColor = 'text-lime-400 animate-pulse';
  } else if (squares.every(square => square !== null)) {
    status = 'DRAW!';
    statusColor = 'text-yellow-400';
  } else {
    status = 'PLAYER: ' + (xIsNext ? 'X' : 'O');
    statusColor = xIsNext ? 'text-cyan-300' : 'text-pink-400';
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`text-sm sm:text-base font-bold mb-5 ${statusColor} 
        drop-shadow-[0_0_12px_currentColor] min-h-[30px] tracking-widest`}
        style={{ fontFamily: "'Press Start 2P', cursive" }}>
        {status}
      </div>
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 
        p-3 rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.7)] 
        border-4 border-purple-400">
        {[0, 1, 2].map(row => (
          <div className="flex gap-2.5 mb-2.5 last:mb-0" key={row}>
            {[0, 1, 2].map(col => {
              const index = row * 3 + col;
              return (
                <Square 
                  key={index}
                  value={squares[index]} 
                  onSquareClick={() => handleClick(index)}
                  isWinning={winningLine && winningLine.includes(index)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const winnerInfo = calculateWinner(currentSquares);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    
    const winnerInfo = calculateWinner(nextSquares);
    if (winnerInfo) {
      if (winnerInfo.winner === 'X') {
        setScoreX(scoreX + 1);
      } else if (winnerInfo.winner === 'O') {
        setScoreO(scoreO + 1);
      }
    }
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  function resetScore() {
    setScoreX(0);
    setScoreO(0);
    resetGame();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 
      flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Efecte de lumini neon animate */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600 rounded-full 
        opacity-25 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500 rounded-full 
        opacity-25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-600 rounded-full 
        opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="bg-black/90 backdrop-blur-md rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.8)] 
        p-5 sm:p-7 max-w-md w-full border-4 border-purple-400 relative z-10">
        
        {/* Titlu Retro */}
        <h1 className="text-xl sm:text-3xl font-bold text-center mb-6
          bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent
          drop-shadow-[0_0_20px_rgba(34,211,238,1)] tracking-widest animate-pulse"
          style={{ fontFamily: "'Press Start 2P', cursive" }}>
          TIC-TAC-TOE
        </h1>
        
        {/* Scoreboard Retro */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 rounded-xl 
          p-4 sm:p-5 mb-6 border-4 border-cyan-300 
          shadow-[0_0_25px_rgba(34,211,238,0.8)]">
          <div className="flex justify-around items-center gap-6">
            <div className="text-center flex-1">
              <div className="text-cyan-300 text-xs sm:text-sm font-semibold mb-2 
                drop-shadow-[0_0_8px_rgba(34,211,238,1)]"
                style={{ fontFamily: "'Press Start 2P', cursive" }}>
                PLAYER X
              </div>
              <div className="text-cyan-300 text-3xl sm:text-4xl font-bold 
                drop-shadow-[0_0_15px_rgba(34,211,238,1)]"
                style={{ fontFamily: "'Press Start 2P', cursive" }}>
                {scoreX}
              </div>
            </div>
            
            <div className="text-white text-3xl sm:text-4xl font-bold opacity-60"
              style={{ fontFamily: "'Press Start 2P', cursive" }}>
              :
            </div>
            
            <div className="text-center flex-1">
              <div className="text-pink-400 text-xs sm:text-sm font-semibold mb-2 
                drop-shadow-[0_0_8px_rgba(236,72,153,1)]"
                style={{ fontFamily: "'Press Start 2P', cursive" }}>
                PLAYER O
              </div>
              <div className="text-pink-400 text-3xl sm:text-4xl font-bold 
                drop-shadow-[0_0_15px_rgba(236,72,153,1)]"
                style={{ fontFamily: "'Press Start 2P', cursive" }}>
                {scoreO}
              </div>
            </div>
          </div>
        </div>

        {/* Board centrat */}
        <div className="mb-6 flex justify-center">
          <Board 
            xIsNext={xIsNext} 
            squares={currentSquares} 
            onPlay={handlePlay}
            winningLine={winnerInfo ? winnerInfo.line : null}
          />
        </div>

        {/* Butoane Retro */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            className="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 text-white 
              px-5 py-3 rounded-lg font-bold text-xs sm:text-sm 
              border-4 border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.8)]
              hover:shadow-[0_0_30px_rgba(34,211,238,1)] hover:scale-105 
              transition-all duration-200 active:scale-95"
            onClick={resetGame}
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            NEW GAME
          </button>
          <button 
            className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 text-white 
              px-5 py-3 rounded-lg font-bold text-xs sm:text-sm 
              border-4 border-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.8)]
              hover:shadow-[0_0_30px_rgba(236,72,153,1)] hover:scale-105 
              transition-all duration-200 active:scale-95"
            onClick={resetScore}
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            RESET
          </button>
        </div>
        
        {/* Decorații pixel art neon în colțuri */}
        <div className="absolute -top-2 -left-2 text-cyan-300 text-2xl opacity-70 
          drop-shadow-[0_0_8px_rgba(34,211,238,1)]">▲</div>
        <div className="absolute -top-2 -right-2 text-pink-400 text-2xl opacity-70 
          drop-shadow-[0_0_8px_rgba(236,72,153,1)]">▲</div>
        <div className="absolute -bottom-2 -left-2 text-pink-400 text-2xl opacity-70 
          drop-shadow-[0_0_8px_rgba(236,72,153,1)]">▼</div>
        <div className="absolute -bottom-2 -right-2 text-cyan-300 text-2xl opacity-70 
          drop-shadow-[0_0_8px_rgba(34,211,238,1)]">▼</div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}