import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Error404 from './pages/Error404'

import Navbar from './components/Navbar'

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/puerta.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error404 />} />

      </Routes>
      <div>
        <a href="https://www.terplac.cl/" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Bienvenido a MundoPuertas!
        </p>
      </div>
      <p className="read-the-docs">
        Click en la puerta para entrar al antiguo MundoPuertas
      </p>

      
    </>
  )
}

export default App
