export interface BlockState {
  x: number
  y: number
  revealed: boolean
  mines: boolean
  flagged: boolean
  adjacentMines: number
}
