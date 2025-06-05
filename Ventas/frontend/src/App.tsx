import { Routes, Route, useLocation, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';
import Error404 from './pages/Error404';
import Login from './pages/Login'

import Navbar from './components/Navbar'

import './App.css'
import 'bootstrap-icons/font/bootstrap-icons.css';


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
        <Route path="/login" element={<Login />} />
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
