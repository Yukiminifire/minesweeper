import { RouterView } from 'vue-router'
import { defineFunctionComponent } from './func/defineFunctionComponent'

export const App = defineFunctionComponent(() => {
  return {
    render() {
      return (
        <div>
          <RouterView></RouterView>
        </div>
      )
    },
  }
})
