interface BlockState {
  x: number
  y: number
  isMine: boolean
  flagged: boolean
  adjacentMine: number
}

export function generateBoard(width: number, height: number) {
  const board: BlockState[][] = []
  for (let y = 0; y < height; y++) {
    const row: BlockState[] = []
    board.push(row)
    for (let x = 0; x < width; x++) {
      const block: BlockState = {
        x,
        y,
        isMine: false,
        flagged: false,
        adjacentMine: 0,
      }
      row.push(block)
    }
  }
  return board
}
