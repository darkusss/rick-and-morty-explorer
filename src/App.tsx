import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home - Coming Soon</div>} />
        <Route path="/character/:id" element={<div>Character Detail - Coming Soon</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
