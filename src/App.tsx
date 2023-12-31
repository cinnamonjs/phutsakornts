import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage.tsx'

function App() {

  return (
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={ <HomePage />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
