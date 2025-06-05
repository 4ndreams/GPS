import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';

import Home from './pages/Home';
import Register from './pages/Register';
import Error404 from './pages/Error404';

import Navbar from './components/Navbar';

import reactLogo from './assets/react.svg';
import viteLogo from '/puerta.png';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Error404 />} />
      </Routes>

      {!shouldHideNavbar && (
        <>
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
            <p>Bienvenido a MundoPuertas!</p>
          </div>
          <p className="read-the-docs">
            Click en la puerta para entrar al antiguo MundoPuertas
          </p>
        </>
      )}
    </>
  );
}

export default App;
