
export const isSolved = (tiles: number[]): boolean => {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i + 1) {
      return false;
    }
  }
  return tiles[tiles.length - 1] === 0;
};

export const shuffleTiles = (size: number): number[] => {
  const tiles = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
  tiles.push(0); // 0 represents the empty tile

  let emptyIndex = tiles.length - 1;
  const moves = size * size * 10; // Number of random moves to make

  for (let i = 0; i < moves; i++) {
    const validMoves = [];
    const row = Math.floor(emptyIndex / size);
    const col = emptyIndex % size;

    // Up
    if (row > 0) validMoves.push(emptyIndex - size);
    // Down
    if (row < size - 1) validMoves.push(emptyIndex + size);
    // Left
    if (col > 0) validMoves.push(emptyIndex - 1);
    // Right
    if (col < size - 1) validMoves.push(emptyIndex + 1);

    const moveIndex = validMoves[Math.floor(Math.random() * validMoves.length)];
    
    // Swap
    [tiles[emptyIndex], tiles[moveIndex]] = [tiles[moveIndex], tiles[emptyIndex]];
    emptyIndex = moveIndex;
  }
  
  // If it accidentally got solved, shuffle again. Very unlikely.
  if (isSolved(tiles)) {
    return shuffleTiles(size);
  }

  return tiles;
};
