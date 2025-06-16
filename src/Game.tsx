import { useState } from 'react'
import Board from './Board'

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

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove)
  }

  const moves = history.map((_, move) => {
    let description: string

    if (move > 0) {
      description = 'Go to move #' + move
    } else {
      description = 'Go to game start'
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

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
        <button onClick={handleReset}>Reset</button>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

export default Game
