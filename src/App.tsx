import { BrowserRouter , Routes , Route } from 'react-router-dom'
import Home from './Pages/Home'
import Match from './Pages/Match'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match" element={<Match />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App