import { defineFunctionComponent } from './func/defineFunctionComponent'
import { getGreeting } from '@template/template'

export const App = defineFunctionComponent(() => {
  return {
    render() {
      return <div>{getGreeting()}</div>
    },
  }
})
