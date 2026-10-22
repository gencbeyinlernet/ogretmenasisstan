import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, ArrowLeft, ArrowRight, ArrowDown, RotateCw, Trophy } from 'lucide-react';

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 20;

const SHAPES = [
  // I
  [[1, 1, 1, 1]],
  // J
  [[1, 0, 0], [1, 1, 1]],
  // L
  [[0, 0, 1], [1, 1, 1]],
  // O
  [[1, 1], [1, 1]],
  // S
  [[0, 1, 1], [1, 1, 0]],
  // T
  [[0, 1, 0], [1, 1, 1]],
  // Z
  [[1, 1, 0], [0, 1, 1]],
];

const COLORS = [
  '#0284c7', // Sky
  '#3b82f6', // Blue
  '#f97316', // Orange
  '#eab308', // Amber
  '#10b981', // Emerald
  '#8b5cf6', // Purple
  '#ef4444', // Red
];

export const MiniTetris: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [grid, setGrid] = useState<number[][]>(() =>
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState<{
    shape: number[][];
    colorIndex: number;
    x: number;
    y: number;
  } | null>(null);

  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('burak_tetris_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [lines, setLines] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const getRandomPiece = useCallback(() => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[shapeIndex];
    return {
      shape,
      colorIndex: shapeIndex,
      x: Math.floor((COLS - shape[0].length) / 2),
      y: 0,
    };
  }, []);

  const resetGame = useCallback(() => {
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setCurrentPiece(getRandomPiece());
    setScore(0);
    setLines(0);
    setIsGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
  }, [getRandomPiece]);

  const checkCollision = useCallback(
    (piece: { shape: number[][]; x: number; y: number }, testGrid: number[][]) => {
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (piece.shape[r][c] !== 0) {
            const newX = piece.x + c;
            const newY = piece.y + r;
            if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
            if (newY >= 0 && testGrid[newY][newX] !== 0) return true;
          }
        }
      }
      return false;
    },
    []
  );

  const rotatePiece = useCallback(() => {
    if (!currentPiece || isPaused || !isPlaying || isGameOver) return;
    const rotatedShape = currentPiece.shape[0].map((_, index) =>
      currentPiece.shape.map((row) => row[index]).reverse()
    );
    const rotated = { ...currentPiece, shape: rotatedShape };
    if (!checkCollision(rotated, grid)) {
      setCurrentPiece(rotated);
    }
  }, [currentPiece, isPaused, isPlaying, isGameOver, checkCollision, grid]);

  const moveLeft = useCallback(() => {
    if (!currentPiece || isPaused || !isPlaying || isGameOver) return;
    const moved = { ...currentPiece, x: currentPiece.x - 1 };
    if (!checkCollision(moved, grid)) {
      setCurrentPiece(moved);
    }
  }, [currentPiece, isPaused, isPlaying, isGameOver, checkCollision, grid]);

  const moveRight = useCallback(() => {
    if (!currentPiece || isPaused || !isPlaying || isGameOver) return;
    const moved = { ...currentPiece, x: currentPiece.x + 1 };
    if (!checkCollision(moved, grid)) {
      setCurrentPiece(moved);
    }
  }, [currentPiece, isPaused, isPlaying, isGameOver, checkCollision, grid]);

  const moveDown = useCallback(() => {
    if (!currentPiece || isPaused || !isPlaying || isGameOver) return;
    const moved = { ...currentPiece, y: currentPiece.y + 1 };
    if (!checkCollision(moved, grid)) {
      setCurrentPiece(moved);
    } else {
      // Lock piece into grid
      const newGrid = grid.map((row) => [...row]);
      for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
          if (currentPiece.shape[r][c] !== 0) {
            const py = currentPiece.y + r;
            const px = currentPiece.x + c;
            if (py >= 0 && py < ROWS && px >= 0 && px < COLS) {
              newGrid[py][px] = currentPiece.colorIndex + 1;
            }
          }
        }
      }

      // Clear full lines
      let cleared = 0;
      const filteredGrid = newGrid.filter((row) => {
        const isFull = row.every((cell) => cell !== 0);
        if (isFull) cleared++;
        return !isFull;
      });

      while (filteredGrid.length < ROWS) {
        filteredGrid.unshift(Array(COLS).fill(0));
      }

      if (cleared > 0) {
        const points = cleared === 1 ? 100 : cleared === 2 ? 300 : cleared === 3 ? 500 : 800;
        setScore((prev) => {
          const next = prev + points;
          if (next > highScore) {
            setHighScore(next);
            localStorage.setItem('burak_tetris_highscore', next.toString());
          }
          return next;
        });
        setLines((prev) => prev + cleared);
      }

      setGrid(filteredGrid);
      const nextPiece = getRandomPiece();
      if (checkCollision(nextPiece, filteredGrid)) {
        setIsGameOver(true);
        setIsPlaying(false);
      } else {
        setCurrentPiece(nextPiece);
      }
    }
  }, [currentPiece, isPaused, isPlaying, isGameOver, checkCollision, grid, getRandomPiece, highScore]);

  // Key bindings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isPaused || isGameOver) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveLeft();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveRight();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveDown();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        rotatePiece();
      } else if (e.key === ' ') {
        e.preventDefault();
        moveDown();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused, isGameOver, moveLeft, moveRight, moveDown, rotatePiece]);

  // Game tick interval
  useEffect(() => {
    if (!isPlaying || isPaused || isGameOver) return;
    const interval = setInterval(() => {
      moveDown();
    }, 550);
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, isGameOver, moveDown]);

  // Render to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = '#0f172a'; // Deep slate
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * BLOCK_SIZE, 0);
      ctx.lineTo(c * BLOCK_SIZE, ROWS * BLOCK_SIZE);
      ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * BLOCK_SIZE);
      ctx.lineTo(COLS * BLOCK_SIZE, r * BLOCK_SIZE);
      ctx.stroke();
    }

    // Draw settled blocks
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const val = grid[r][c];
        if (val > 0) {
          ctx.fillStyle = COLORS[val - 1];
          ctx.fillRect(c * BLOCK_SIZE + 1, r * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.fillRect(c * BLOCK_SIZE + 1, r * BLOCK_SIZE + 1, BLOCK_SIZE - 2, 3);
        }
      }
    }

    // Draw active falling piece
    if (currentPiece) {
      ctx.fillStyle = COLORS[currentPiece.colorIndex];
      for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
          if (currentPiece.shape[r][c] !== 0) {
            const px = (currentPiece.x + c) * BLOCK_SIZE;
            const py = (currentPiece.y + r) * BLOCK_SIZE;
            ctx.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, 3);
            ctx.fillStyle = COLORS[currentPiece.colorIndex];
          }
        }
      }
    }
  }, [grid, currentPiece]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            Mini Tetris <span className="text-xs font-normal text-slate-500">· Zihin Molası</span>
          </h3>
          <p className="text-xs text-slate-500">Teneffüslerde veya serbest etkinlik saatinde eğlenceli pratik</p>
        </div>
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={resetGame}
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play size={14} /> Başlat
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                {isPaused ? <Play size={13} /> : <Pause size={13} />}
                {isPaused ? 'Devam' : 'Duraklat'}
              </button>
              <button
                onClick={resetGame}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Yeniden Başlat"
              >
                <RotateCcw size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-6">
        {/* Canvas Display */}
        <div className="relative rounded-lg overflow-hidden border border-slate-800 shadow-md">
          <canvas
            ref={canvasRef}
            width={COLS * BLOCK_SIZE}
            height={ROWS * BLOCK_SIZE}
            className="block"
          />

          {!isPlaying && !isGameOver && (
            <div className="absolute inset-0 bg-slate-950/75 flex flex-col items-center justify-center text-center p-4">
              <p className="text-white font-medium text-sm mb-2">Mini Tetris</p>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                Oyuna Başla
              </button>
              <p className="text-[11px] text-slate-400 mt-3">Yön tuşları veya butonlarla oynayabilirsiniz</p>
            </div>
          )}

          {isGameOver && (
            <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center text-center p-4">
              <span className="text-xs text-rose-400 font-semibold mb-1">Oyun Bitti</span>
              <p className="text-white text-lg font-bold mb-1">Skor: {score}</p>
              <button
                onClick={resetGame}
                className="mt-3 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg cursor-pointer"
              >
                Tekrar Oyna
              </button>
            </div>
          )}
        </div>

        {/* Stats & On-screen controls */}
        <div className="flex flex-col justify-between w-full max-w-[200px] gap-4">
          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
              <span className="text-[11px] text-slate-500 block mb-0.5">Mevcut Skor</span>
              <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">{score}</span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">En Yüksek</span>
                <span className="text-sm font-semibold font-mono text-amber-600 tabular-nums">{highScore}</span>
              </div>
              <Trophy size={18} className="text-amber-500" />
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
              <span className="text-[11px] text-slate-500 block mb-0.5">Temizlenen Hat</span>
              <span className="text-sm font-semibold font-mono text-slate-800 tabular-nums">{lines} satır</span>
            </div>
          </div>

          {/* Touch / Quick Click Controls */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 font-medium block mb-2 text-center">Hızlı Kontroller</span>
            <div className="grid grid-cols-3 gap-1.5">
              <div></div>
              <button
                onClick={rotatePiece}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                title="Döndür (Yukarı Ok)"
              >
                <RotateCw size={15} />
              </button>
              <div></div>

              <button
                onClick={moveLeft}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                title="Sol (Sol Ok)"
              >
                <ArrowLeft size={15} />
              </button>
              <button
                onClick={moveDown}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                title="Aşağı (Aşağı Ok)"
              >
                <ArrowDown size={15} />
              </button>
              <button
                onClick={moveRight}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                title="Sağ (Sağ Ok)"
              >
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
