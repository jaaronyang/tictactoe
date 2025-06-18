import { useState, useEffect } from 'react'
import { IconButton } from '@mui/material'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import Board from './Board'
import moveSound from './assets/move-sound.mp3'

function Game() {
  const [history, setHistory] = useState<string[][]>([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState<number>(0)
  const xIsNext: boolean = currentMove % 2 === 0
  const currentSquares: string[] = history[currentMove]

  function playMoveSound(): void {
    new Audio(moveSound).play().catch(() => {})
  }

  function calculateWinner(squares: string[]): string | null {
    const lines: number[][] = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c]: number[] = lines[i]
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a]
      }
    }

    return null
  }

  function isBoardFull(squares: string[]): boolean {
    return squares.every((square) => square !== null)
  }

  const winner: string | null = calculateWinner(currentSquares)
  const isDraw: boolean = !winner && isBoardFull(currentSquares)

  function minimax(
    squares: string[],
    depth: number,
    isMaximizing: boolean
  ): number {
    const winner: string | null = calculateWinner(squares)

    if (winner === 'O') return 10 - depth
    if (winner === 'X') return depth - 10
    if (isBoardFull(squares)) return 0

    if (isMaximizing) {
      let bestScore: number = -Infinity
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          const nextSquares = squares.slice()
          nextSquares[i] = 'O'
          const score = minimax(nextSquares, depth + 1, false)
          bestScore = Math.max(score, bestScore)
        }
      }
      return bestScore
    } else {
      let bestScore: number = Infinity
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          const nextSquares = squares.slice()
          nextSquares[i] = 'X'
          const score = minimax(nextSquares, depth + 1, true)
          bestScore = Math.min(score, bestScore)
        }
      }
      return bestScore
    }
  }

  function findBestMove(squares: string[]): number {
    let bestScore: number = -Infinity
    let bestMove: number = -1

    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const nextSquares = squares.slice()
        nextSquares[i] = 'O'
        const score = minimax(nextSquares, 0, false)
        if (score > bestScore) {
          bestScore = score
          bestMove = i
        }
      }
    }

    return bestMove
  }

  function handlePlay(nextSquares: string[]) {
    const nextHistory: string[][] = [
      ...history.slice(0, currentMove + 1),
      nextSquares,
    ]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
    playMoveSound()
  }

  useEffect(() => {
    if (
      !xIsNext &&
      !calculateWinner(currentSquares) &&
      !isBoardFull(currentSquares)
    ) {
      const timeoutId = setTimeout(() => {
        const bestMove = findBestMove(currentSquares)
        if (bestMove !== -1) {
          const nextSquares = currentSquares.slice()
          nextSquares[bestMove] = 'O'
          handlePlay(nextSquares)
        }
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [xIsNext, currentSquares])

  function handleUndo() {
    if (currentMove > 0) {
      const movesToUndo = currentMove > 1 ? 2 : 1
      setCurrentMove(currentMove - movesToUndo)
    }
  }

  function handleRedo() {
    if (currentMove < history.length - 1) {
      const movesToRedo = currentMove < history.length - 2 ? 2 : 1
      setCurrentMove(currentMove + movesToRedo)
    }
  }

  function handleReset() {
    setHistory([Array(9).fill(null)])
    setCurrentMove(0)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          winner={winner}
          isDraw={isDraw}
        />
      </div>
      <div className="game-info">
        <IconButton
          onClick={handleUndo}
          disabled={currentMove === 0}
          aria-label="Undo"
          size="large"
        >
          <UndoIcon />
        </IconButton>
        <IconButton
          onClick={handleReset}
          disabled={currentMove === 0 && history.length === 1}
          aria-label="Reset"
          size="large"
        >
          <RestartAltIcon />
        </IconButton>
        <IconButton
          onClick={handleRedo}
          disabled={currentMove === history.length - 1}
          aria-label="Redo"
          size="large"
        >
          <RedoIcon />
        </IconButton>
      </div>
    </div>
  )
}

export default Game
