import { useState } from 'react'
import Board from './Board'
import { IconButton } from '@mui/material'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import RestartAltIcon from '@mui/icons-material/RestartAlt'

function Game() {
  const [history, setHistory] = useState<string[][]>([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState<number>(0)
  const xIsNext: boolean = currentMove % 2 === 0
  const currentSquares: string[] = history[currentMove]

  function handlePlay(nextSquares: string[]) {
    const nextHistory: string[][] = [
      ...history.slice(0, currentMove + 1),
      nextSquares,
    ]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function handleUndo() {
    if (currentMove > 0) {
      setCurrentMove(currentMove - 1)
    }
  }

  function handleRedo() {
    if (currentMove < history.length - 1) {
      setCurrentMove(currentMove + 1)
    }
  }

  function handleReset() {
    setHistory([Array(9).fill(null)])
    setCurrentMove(0)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
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
        <IconButton onClick={handleReset} aria-label="Reset" size="large">
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
