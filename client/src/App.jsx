import {RouterProvider} from 'react-router-dom'
import { router } from './Router';

function App() {
  console.log(1+1);
  return (
  <div>
    <RouterProvider router={router}/>
  </div>
  )
}

export default App
