import { defineFunctionComponent } from './func/defineFunctionComponent'
import Login from './Login.vue'

export const App = defineFunctionComponent(() => {
  return {
    render() {
      return (
        <div>
          <Login />
        </div>
      )
    },
  }
})
