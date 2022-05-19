import axios from 'axios'

export const greeting = 'hello  ——@template/core'
export interface RankInfo {
  id: number
  name: string
  time: number
}

export async function getRankList() {
  const data = await axios.get<RankInfo[]>(
    'https://minesweeper-cloudbase-7a2ff16b6d-1310260690.ap-shanghai.app.tcloudbase.com/getRank',
  )
  return data.data
}
