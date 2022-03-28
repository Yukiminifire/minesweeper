import { defineFunctionComponent } from './func/defineFunctionComponent'
import MineSweeper from './MineSweeper.vue'

export const App = defineFunctionComponent(() => {
  return {
    render() {
      return (
        <div>
          <MineSweeper />
        </div>
      )
    },
  }
})
