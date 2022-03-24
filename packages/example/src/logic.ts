import { BlockState } from './component/type'

export function generateBoard(width: number, height: number) {
  const myBoard: BlockState[][] = []
  for (let y = 0; y < height; y++) {
    const row: BlockState[] = []
    myBoard.push(row)
    for (let x = 0; x < width; x++) {
      const block: BlockState = {
        x,
        y,
        revealed: false,
        isMine: false,
        flagged: false,
        adjacentMines: 0,
      }
      row.push(block)
    }
  }

  return myBoard
}

export interface GameState {
  board: BlockState[][]
  mineGenerated: boolean
  mineCount: number
  time: {
    start: number
    end: number
  }
}

export function gennerateGameState(
  width: number,
  height: number,
  mineCount: number,
) {
  const gameState: GameState = {
    board: generateBoard(width, height),
    mineGenerated: false,
    mineCount,
    time: {
      start: NaN,
      end: NaN,
    },
  }

  return gameState
}

const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
]
type GameStatus = 'play' | 'won' | 'lost'

function generateMine(board: BlockState[][], initBlock: BlockState) {
  const x = Math.floor(Math.random() * board[0].length)
  const y = Math.floor(Math.random() * board.length)
  const block = board[y][x]
  if (block.isMine || (x === initBlock.x && y === initBlock.y)) {
    return false
  } else {
    block.isMine = true
    return true
  }
}

export function generateMines(
  board: BlockState[][],
  mineCount: number,
  initBlock: BlockState,
) {
  for (let index = 0; index < mineCount; index++) {
    let success = false
    while (!success) {
      success = generateMine(board, initBlock)
    }
  }
  undateNumbers(board)
}

function getArounds(board: BlockState[][], centerBlock: BlockState) {
  const aroundBlocks = directions
    .map((direction) => {
      const dx = direction[0]
      const dy = direction[1]
      const x = centerBlock.x + dx
      const y = centerBlock.y + dy

      if (x === board[0].length || y === board.length || x === -1 || y === -1) {
        return null
      } else {
        return board[y][x]
      }
    })
    .filter((aroundBlock) => {
      return Boolean(aroundBlock)
    }) as BlockState[]

  return aroundBlocks
}

export function expendZero(board: BlockState[][], centerBlock: BlockState) {
  if (centerBlock.isMine) {
    throw new Error('exendZero 不能展开雷')
  }

  if (!centerBlock.revealed) {
    throw new Error('exendZero 不能展开未翻开的格子')
  }

  if (centerBlock.adjacentMines === 0) {
    const arounds = getArounds(board, centerBlock)

    arounds.forEach((i) => {
      if (!i.revealed) {
        i.revealed = true
        expendZero(board, i)
      }
    })
  }
}

export function undateNumbers(board: BlockState[][]) {
  board.forEach((row) => {
    row.forEach((block) => {
      if (!block.isMine) {
        getArounds(board, block).forEach((i) => {
          if (i.isMine) {
            block.adjacentMines += 1
          }
        })
      }
    })
  })
}

export function showAllmines(board: BlockState[][], block: BlockState) {
  if (block.isMine) {
    board.forEach((row) => {
      row.forEach((i) => {
        if (i.isMine) {
          i.revealed = true
        }
      })
    })
  }
}

export function onRightClick(gameState: GameState, block: BlockState) {
  if (!block.revealed) {
    if (block.flagged) {
      block.flagged = false
    } else {
      block.flagged = true
    }
  }
}

function initGameState(gameState: GameState, block: BlockState) {
  const { board, mineCount, mineGenerated } = gameState
  if (mineGenerated) {
    throw new Error('game state already inited')
  }

  generateMines(board, mineCount, block)
  gameState.mineGenerated = true
  gameState.time.start = Date.now()
}

function revealeBlock(board: BlockState[][], centerBlock: BlockState) {
  centerBlock.revealed = true
  if (!centerBlock.isMine) {
    expendZero(board, centerBlock)
  }
}

export function onClick(gameState: GameState, block: BlockState) {
  const { mineGenerated, board } = gameState

  console.log('onClick')

  if (!mineGenerated) {
    initGameState(gameState, block)
  }

  if (!block.flagged) {
    revealeBlock(board, block)
  }
}

export function onDbClick(gameState: GameState, block: BlockState) {
  const { board } = gameState

  console.log('onDbClick')

  if (!block.flagged) {
    autoExpend(board, block)
  }
}

function autoExpend(board: BlockState[][], centerBlock: BlockState) {
  if (centerBlock.adjacentMines > 0) {
    const arounds = getArounds(board, centerBlock)

    const flags = arounds.reduce((sum, i) => {
      return sum + (i.flagged ? 1 : 0)
    }, 0)

    const revealed = arounds.reduce((sum, i) => {
      return sum + (i.revealed ? 1 : 0)
    }, 0)

    const unRevealed = 8 - revealed - flags

    if (centerBlock.adjacentMines - flags === unRevealed) {
      arounds
        .filter((i) => {
          return !i.revealed && !i.flagged
        })
        .forEach((i) => {
          i.flagged = true
        })
    }

    if (centerBlock.adjacentMines - flags === 0 && unRevealed > 0) {
      arounds
        .filter((i) => {
          return !i.revealed && !i.flagged
        })
        .forEach((i) => {
          i.revealed = true
          expendZero(board, i)
        })
    }
  }
}

export function checkGameStatus(gameState: GameState): GameStatus {
  const { board, mineCount } = gameState
  const isLost = board.some((row) => {
    return row.some((i) => {
      return i.isMine && i.revealed
    })
  })

  if (isLost) {
    return 'lost'
  }

  const flags = board.reduce((rSum, row) => {
    return (
      rSum +
      row.reduce((sum, i) => {
        return sum + (i.flagged ? 1 : 0)
      }, 0)
    )
  }, 0)

  const unRevealed = board.reduce((rSum, row) => {
    return (
      rSum +
      row.reduce((sum, i) => {
        return sum + (!i.revealed && !i.flagged ? 1 : 0)
      }, 0)
    )
  }, 0)

  const isWin = flags + unRevealed === mineCount
  if (isWin) {
    return 'won'
  }

  return 'play'
}
