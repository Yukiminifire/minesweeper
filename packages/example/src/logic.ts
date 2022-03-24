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
        mines: false,
        flagged: false,
        adjacentMines: 0,
      }
      row.push(block)
    }
  }

  return myBoard
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

export interface GameState {
  board: BlockState[][]
  mineGenerated: boolean
  status: GameStatus
}

function generateMine(board: BlockState[][], initBlock: BlockState) {
  const x = Math.floor(Math.random() * board[0].length)
  const y = Math.floor(Math.random() * board.length)
  const block = board[y][x]
  if (block.mines || (x === initBlock.x && y === initBlock.y)) {
    return false
  } else {
    block.mines = true
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
  if (centerBlock.mines) {
    throw new Error('exendZero 不能展开雷')
  }
  if (centerBlock.adjacentMines > 0) {
    return
  } else {
    getArounds(board, centerBlock).forEach((i) => {
      if (!i.revealed) {
        return (i.revealed = true)
      }
      expendZero(board, i)
    })
  }
}

export function undateNumbers(board: BlockState[][]) {
  board.forEach((row) => {
    row.forEach((block) => {
      if (!block.mines) {
        getArounds(board, block).forEach((i) => {
          if (i.mines) {
            block.adjacentMines += 1
          }
        })
      }
    })
  })
}

export function showAllmines(board: BlockState[][], block: BlockState) {
  if (block.mines) {
    board.forEach((row) => {
      row.forEach((i) => {
        if (i.mines) {
          i.revealed = true
        }
      })
    })
  }
}

export function onRightClick(board: BlockState[][], block: BlockState) {
  if (!block.flagged) {
    board.forEach((row) => {
      row.forEach((i) => {
        if (!i.flagged) {
          i.flagged = true
        } else {
          block.flagged = !block.flagged
        }
      })
    })
  }
}

export function onClick(board: BlockState[][], block: BlockState) {
  if (block.flagged) {
    return
  }
  if (block.mines) {
    return showAllmines(board, block)
  }
  return board.forEach((row) => {
    row.forEach((i) => {
      if (i.adjacentMines) {
        return (i.revealed = true)
      }
    })
  })
}