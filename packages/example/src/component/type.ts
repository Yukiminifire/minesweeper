export interface BlockState {
  x: number
  y: number
  revealed: boolean
  isMine: boolean
  flagged: boolean
  adjacentMine: number
}
