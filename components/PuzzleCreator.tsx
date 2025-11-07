
import React, { useState, useRef, useEffect } from 'react';

const PuzzleCreator: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [secretMessage, setSecretMessage] = useState<string>('');
  const [gridSize, setGridSize] = useState<number>(3);
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [imgValid, setImgValid] = useState<boolean | null>(null);

  const qrCodeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (generatedUrl && qrCodeRef.current) {
      (window as any).QRCode.toCanvas(qrCodeRef.current, generatedUrl, { width: 256, color: { dark: '#FFFFFF', light: '#1E293B' } }, (error: Error) => {
        if (error) console.error(error);
      });
    }
  }, [generatedUrl]);

  const handleImageCheck = () => {
    if (!imageUrl) {
        setImgValid(null);
        return;
    }
    const img = new Image();
    img.onload = () => setImgValid(true);
    img.onerror = () => setImgValid(false);
    img.src = imageUrl;
  };

  const handleGenerate = () => {
    if (!imageUrl || !secretMessage || !imgValid) {
      setError('Please provide a valid image URL and a secret message.');
      return;
    }
    setError('');

    const data = { imageUrl, secretMessage, size: gridSize };
    const encodedData = btoa(JSON.stringify(data));
    const url = `${window.location.origin}${window.location.pathname}#${encodedData}`;
    setGeneratedUrl(url);
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl).then(() => {
        alert('Link copied to clipboard!');
    });
  };

  const resetForm = () => {
    setImageUrl('');
    setSecretMessage('');
    setGridSize(3);
    setGeneratedUrl('');
    setError('');
    setImgValid(null);
  }

  if (generatedUrl) {
    return (
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-lg mx-auto flex flex-col items-center animate-fade-in">
        <h2 className="text-2xl font-bold mb-4 text-purple-400">Your Puzzle is Ready!</h2>
        <p className="text-slate-400 mb-6 text-center">Share the link or QR code with your friends.</p>
        <div className="w-full bg-slate-900 p-4 rounded-md mb-4 break-all text-sm">
          {generatedUrl}
        </div>
        <button
          onClick={handleCopyToClipboard}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors w-full mb-6"
        >
          Copy Link
        </button>
        <canvas ref={qrCodeRef} className="rounded-lg bg-slate-700"></canvas>
        <button
          onClick={resetForm}
          className="mt-8 text-pink-500 hover:text-pink-400 font-semibold"
        >
          Create Another Puzzle
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-lg mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-400">Create a New Puzzle</h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-300 mb-2">Image URL</label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImgValid(null);
              }}
              onBlur={handleImageCheck}
              placeholder="https://picsum.photos/400"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
             <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-md bg-slate-700 border border-slate-600">
                {imgValid === true && <span className="text-green-400">✓</span>}
                {imgValid === false && <span className="text-red-400">✗</span>}
            </div>
          </div>
          {imgValid && <img src={imageUrl} alt="Preview" className="mt-4 rounded-md max-h-40 mx-auto" />}
        </div>

        <div>
          <label htmlFor="secretMessage" className="block text-sm font-medium text-slate-300 mb-2">Secret Message</label>
          <textarea
            id="secretMessage"
            value={secretMessage}
            onChange={(e) => setSecretMessage(e.target.value)}
            placeholder="The treasure is hidden under the old oak tree."
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="gridSize" className="block text-sm font-medium text-slate-300 mb-2">Difficulty (Grid Size)</label>
          <select
            id="gridSize"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={3}>Easy (3x3)</option>
            <option value={4}>Medium (4x4)</option>
            <option value={5}>Hard (5x5)</option>
          </select>
        </div>
      </div>

      {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
      
      <button
        onClick={handleGenerate}
        disabled={!imgValid || !secretMessage}
        className="mt-8 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-bold py-3 px-4 rounded-md transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Generate Puzzle Link
      </button>
    </div>
  );
};

export default PuzzleCreator;
