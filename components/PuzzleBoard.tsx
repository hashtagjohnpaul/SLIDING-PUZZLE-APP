
import React, { useState, useEffect, useMemo } from 'react';
import { shuffleTiles, isSolved } from '../utils/puzzleUtils';

interface PuzzleBoardProps {
  imageUrl: string;
  secretMessage: string;
  size: number;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ imageUrl, secretMessage, size }) => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const newTiles = shuffleTiles(size);
    setTiles(newTiles);
    setSolved(isSolved(newTiles));
    setMoves(0);
  }, [size]);

  const TILE_SIZE = useMemo(() => Math.min(100, 400 / size), [size]);
  const PUZZLE_DIM = TILE_SIZE * size;
  
  const handleTileClick = (index: number) => {
    if (solved) return;

    const emptyIndex = tiles.indexOf(0);
    const tileRow = Math.floor(index / size);
    const tileCol = index % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;

    const isAdjacent = Math.abs(tileRow - emptyRow) + Math.abs(tileCol - emptyCol) === 1;

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(m => m + 1);
      if (isSolved(newTiles)) {
        setSolved(true);
      }
    }
  };

  const getTileStyle = (tileValue: number) => {
    if (tileValue === 0) return { background: 'transparent' };
    
    const correctIndex = tileValue - 1;
    const correctRow = Math.floor(correctIndex / size);
    const correctCol = correctIndex % size;

    const bgPosX = -(correctCol * TILE_SIZE);
    const bgPosY = -(correctRow * TILE_SIZE);

    return {
      width: `${TILE_SIZE}px`,
      height: `${TILE_SIZE}px`,
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: `${PUZZLE_DIM}px ${PUZZLE_DIM}px`,
      backgroundPosition: `${bgPosX}px ${bgPosY}px`,
    };
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="mb-4 text-lg">Moves: <span className="font-bold text-purple-400">{moves}</span></div>
      <div 
        className="grid bg-slate-700 p-2 rounded-lg shadow-lg"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          width: `${PUZZLE_DIM + 16}px`, // 16 for padding
          height: `${PUZZLE_DIM + 16}px`,
          gap: '4px'
        }}
      >
        {tiles.map((tile, index) => (
          <div
            key={index}
            onClick={() => handleTileClick(index)}
            className={`flex items-center justify-center rounded-md transition-all duration-200 ease-in-out ${tile !== 0 ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
            style={getTileStyle(tile)}
          >
          </div>
        ))}
      </div>

      {solved && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center animate-fade-in rounded-lg">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-yellow-300 to-orange-400 mb-4">
            Congratulations!
          </h2>
          <p className="text-slate-300 mb-2">You solved it in {moves} moves.</p>
          <div className="bg-slate-900 p-6 rounded-lg max-w-sm text-center shadow-lg border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Secret Message Unlocked:</p>
            <p className="text-lg text-yellow-300 font-semibold">{secretMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzleBoard;
