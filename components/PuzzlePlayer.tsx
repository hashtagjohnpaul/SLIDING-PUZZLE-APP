
import React, { useState } from 'react';
import type { PuzzleData } from '../types';
import PuzzleBoard from './PuzzleBoard';

interface PuzzlePlayerProps {
  data: PuzzleData;
}

const PuzzlePlayer: React.FC<PuzzlePlayerProps> = ({ data }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const handleNewPuzzleClick = () => {
      window.location.hash = '';
  }
  
  return (
    <div className="w-full flex flex-col items-center">
      {!isImageLoaded && !imageLoadError && (
        <div className="text-center p-8">
            <p className="text-lg">Loading puzzle image...</p>
            <div className="mt-4 w-12 h-12 border-4 border-slate-600 border-t-purple-400 rounded-full animate-spin mx-auto"></div>
        </div>
      )}

      {imageLoadError && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md mb-6 max-w-lg w-full text-center">
            <p className="font-bold">Image Error</p>
            <p className="text-sm">Could not load the image for this puzzle. It might be broken or private.</p>
        </div>
      )}

      {/* This hidden image triggers the load events */}
      <img 
        src={data.imageUrl} 
        onLoad={() => setIsImageLoaded(true)} 
        onError={() => {
            setImageLoadError(true);
            setIsImageLoaded(false);
        }}
        className="hidden" 
        alt="Puzzle preloader"
      />
      
      <div className={isImageLoaded ? 'block' : 'hidden'}>
        <PuzzleBoard 
            imageUrl={data.imageUrl} 
            secretMessage={data.secretMessage} 
            size={data.size} 
        />
      </div>

      <button
        onClick={handleNewPuzzleClick}
        className="mt-8 text-pink-500 hover:text-pink-400 font-semibold transition-colors"
       >
        Or, Create Your Own Puzzle
       </button>
    </div>
  );
};

export default PuzzlePlayer;
