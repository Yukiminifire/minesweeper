import { BlockState } from './component/type'

export function generateBoard(width: number, height: number) {
  const board: BlockState[][] = []
  for (let y = 0; y < height; y++) {
    const row: BlockState[] = []
    board.push(row)
    for (let x = 0; x < width; x++) {
      const block: BlockState = {
        x,
        y,
        revealed: false,
        isMine: false,
        flagged: false,
        adjacentMine: 0,
      }
      row.push(block)
    }
  }
  return board
}

function generateMine(board: BlockState[][], initBlcok: BlockState) {
  const x = Math.floor(Math.random() * board[0].length)
  const y = Math.floor(Math.random() * board.length)
  const randomBlock = board[y][x]
  if (randomBlock.isMine || (initBlcok.x === x && initBlcok.y === y)) {
    generateMine(board, initBlcok)
  } else {
    randomBlock.isMine = true
  }
}

export function generateMines(
  board: BlockState[][],
  mineCount: number,
  initBlcok: BlockState,
) {
  for (let index = 0; index < mineCount; index++) {
    generateMine(board, initBlcok)
  }
}

const direction = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, 1],
  [0, -1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
]

export function getArounds(board: BlockState[][], centerBlcok: BlockState) {
  const aroundBlocks = direction
    .map((direction) => {
      const dx = direction[0]
      const dy = direction[1]
      const x = centerBlcok.x + dx
      const y = centerBlcok.y + dy
      if (x === board[0].length || y === board.length || x === -1 || y === -1) {
        return null
      } else {
        return board[y][x]
      }
    })
    .filter((aroundBlocks) => {
      return Boolean(aroundBlocks)
    }) as BlockState[]
  return aroundBlocks
}

export interface GameState {
  board: BlockState[][]
  isMineGenerated: boolean
  mineCount: number
  time: {
    start: number
    end: number
  }
}

export function generateGameState(
  width: number,
  height: number,
  mineCount: number,
) {
  const gameState: GameState = {
    board: generateBoard(width, height),
    isMineGenerated: false,
    mineCount,
    time: {
      start: NaN,
      end: NaN,
    },
  }
  return gameState
}

export function initGameState(gameState: GameState, block: BlockState) {
  const { board, mineCount, isMineGenerated } = gameState
  if (isMineGenerated) {
    throw new Error('game state is already inited')
  }
  generateMines(board, mineCount, block)
  gameState.isMineGenerated = true
  gameState.time.start = Date.now()
}

function revealeBlocks(board: BlockState[][], centerBlcok: BlockState) {
  centerBlcok.revealed = true
}

function showAllMines(board: BlockState[][], centerBlcok: BlockState) {
  if (centerBlcok.isMine) {
    board.forEach((row) => {
      row.forEach((block) => {
        if (block.isMine) {
          block.revealed = true
        }
      })
    })
  }
}

export function onClick(gameState: GameState, block: BlockState) {
  const { board, isMineGenerated } = gameState
  if (!isMineGenerated) {
    initGameState(gameState, block)
  }
  if (!block.flagged) {
    revealeBlocks(board, block)
  }
  if (block.isMine) {
    showAllMines(board, block)
  }
}
