
import React, { useState, useEffect } from 'react';
import PuzzleCreator from './components/PuzzleCreator';
import PuzzlePlayer from './components/PuzzlePlayer';
import type { PuzzleData } from './types';

const App: React.FC = () => {
  const [puzzleData, setPuzzleData] = useState<PuzzleData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const parseHash = () => {
    try {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const decodedString = atob(hash);
        const data = JSON.parse(decodedString);
        // Basic validation
        if (data.imageUrl && data.secretMessage && data.size) {
            setPuzzleData(data);
            setError(null);
        } else {
            setError("Invalid puzzle data in URL. Creating a new puzzle.");
            setPuzzleData(null);
        }
      } else {
        setPuzzleData(null);
        setError(null);
      }
    } catch (e) {
      console.error("Failed to parse hash:", e);
      setError("The puzzle link seems to be broken. You can create a new puzzle below.");
      setPuzzleData(null);
      window.location.hash = '';
    }
  };

  useEffect(() => {
    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => {
      window.removeEventListener('hashchange', parseHash);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center p-4">
        <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Sliding Puzzle Quest
            </h1>
            <p className="text-slate-400 mt-2">Create an image puzzle, reveal a secret message.</p>
        </header>
        
        {error && <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md mb-6 max-w-lg w-full text-center">{error}</div>}

        <main className="w-full max-w-4xl">
            {puzzleData ? (
                <PuzzlePlayer data={puzzleData} />
            ) : (
                <PuzzleCreator />
            )}
        </main>
        <footer className="mt-8 text-center text-slate-500 text-sm">
            <p>Built by a world-class senior frontend React engineer.</p>
        </footer>
    </div>
  );
};

export default App;
