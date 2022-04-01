import confetti from 'canvas-confetti'
import { ref } from 'vue'
import { BlockState } from './component/type'
import { useCloudbase } from './database'

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
  updateNumbers(board)
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

function expendZero(board: BlockState[][], centerBlcok: BlockState) {
  if (centerBlcok.isMine) {
    throw new Error('不能展开雷')
  }
  if (!centerBlcok.revealed) {
    throw new Error('不能展开未翻开的格子')
  }
  if (centerBlcok.adjacentMine === 0) {
    const arounds = getArounds(board, centerBlcok)
    arounds.forEach((i) => {
      if (!i.revealed) {
        i.revealed = true
        expendZero(board, i)
      }
    })
  }
}

function revealeBlocks(board: BlockState[][], centerBlcok: BlockState) {
  centerBlcok.revealed = true
  if (!centerBlcok.isMine) {
    expendZero(board, centerBlcok)
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
}

export function onRightClick(block: BlockState) {
  if (!block.flagged) {
    block.flagged = true
  } else {
    block.flagged = false
  }
}

function updateNumbers(board: BlockState[][]) {
  board.forEach((row) => {
    row.forEach((block) => {
      if (!block.isMine) {
        getArounds(board, block).forEach((i) => {
          if (i.isMine) {
            block.adjacentMine += 1
          }
        })
      }
    })
  })
}

export function autoExpend(board: BlockState[][], centerBlcok: BlockState) {
  if (centerBlcok.adjacentMine > 0) {
    const arounds = getArounds(board, centerBlcok)
    const flags = arounds.reduce((sum, i) => {
      return sum + (i.flagged ? 1 : 0)
    }, 0)

    const revealed = arounds.reduce((sum, i) => {
      return sum + (i.revealed ? 1 : 0)
    }, 0)
    const unRevealed = arounds.length - flags - revealed
    if (centerBlcok.adjacentMine - flags === unRevealed) {
      arounds
        .filter((i) => {
          return !i.revealed && !i.flagged
        })
        .forEach((i) => {
          i.flagged = true
        })
    }
    if (centerBlcok.adjacentMine - flags === 0 && unRevealed > 0) {
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

export function dbClick(board: BlockState[][], block: BlockState) {
  if (!block.flagged) {
    autoExpend(board, block)
  }
}

export type GameStatus = 'play' | 'won' | 'lost'

export function checkGameState(gameState: GameState): GameStatus {
  const { board, mineCount } = gameState
  const isLost = board.some((row) => {
    return row.some((block) => {
      return block.isMine && block.revealed
    })
  })

  if (isLost) {
    return 'lost'
  }

  const flags = board.reduce((rSum, row) => {
    return (
      rSum +
      row.reduce((sum, block) => {
        return sum + (block.flagged ? 1 : 0)
      }, 0)
    )
  }, 0)
  const unRevealed = board.reduce((rSum, row) => {
    return (
      rSum +
      row.reduce((sum, block) => {
        return sum + (!block.revealed && !block.flagged ? 1 : 0)
      }, 0)
    )
  }, 0)
  const isWin = flags + unRevealed === mineCount
  if (isWin) {
    return 'won'
  }
  return 'play'
}

var count = 200
var defaults = {
  origin: { y: 0.7 },
}

function fire(particleRatio: number, opts: confetti.Options) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    }),
  )
}

export function fireWork() {
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  })
  fire(0.2, {
    spread: 60,
  })
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  })
}

export function useNow() {
  const now = ref(0)

  type Status = 'running' | 'pause'
  const status = ref<Status>('pause')

  function updateNow() {
    if (status.value === 'running') {
      now.value = Date.now()

      setTimeout(() => {
        updateNow()
      }, 1000)
    }
  }
  function run() {
    if (status.value !== 'running') {
      status.value = 'running'
      updateNow()
    }
  }
  function stop() {
    now.value = Date.now()
    status.value = 'pause'
  }
  return {
    now,
    run,
    stop,
  }
}

export const cloudbase = useCloudbase()

export async function saveCloud(
  name: string,
  time: number,
  status: GameStatus,
) {
  if (cloudbase.status.value === 'ready') {
    const db = cloudbase.app.database()
    const saveResult = await db.collection('rank4').add({
      name,
      time: time,
      status,
    })
    console.log('save res', saveResult)
  }
}

export interface RankInfo {
  id: number
  name: string
  time: number
  status: GameStatus
}

export async function getRankList() {
  if (cloudbase.status.value === 'ready') {
    const db = cloudbase.app.database()
    const rankResult = await db
      .collection('rank4')
      .orderBy('time', 'asc')
      .limit(10)
      .get()
    return rankResult.data as RankInfo[]
  } else {
    return []
  }
}
