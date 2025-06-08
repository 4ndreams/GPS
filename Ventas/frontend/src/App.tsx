import { Routes, Route, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';
import Error404 from './pages/Error404';
import Login from './pages/Login'
import VerifiedEmail from './pages/VerifiedEmail';
import ProfilePage from './pages/ProfilePage';

import Navbar from './components/Navbar'

import './App.css'
import 'bootstrap-icons/font/bootstrap-icons.css';


function App() {
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
        <Route path="/verified-email" element={<VerifiedEmail />} />
        <Route path="/profile" element={<ProfilePage />} />

      </Routes>

    </>
  );
}

export default App;
