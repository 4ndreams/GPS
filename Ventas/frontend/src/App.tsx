import { Routes, Route, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';
import Error404 from './pages/Error404';
import Login from './pages/Login'
import VerifiedEmail from './pages/VerifiedEmail';
import ProfilePage from './pages/ProfilePage';
import Productos from './pages/Productos';
import AboutUs from './pages/AboutUs';

import Navbar from './components/Navbar'

import './App.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from "react";
import { getUserProfile } from './services/userService.ts';

function App() {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  const [user, setUser] = useState(null);

  
  
  
  useEffect(() => {
    getUserProfile()
      .then((data) => setUser(data))
      .catch(() => setUser(null));
      console.log("User profile fetched:", ); 
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  return (
    <>      {!shouldHideNavbar && <Navbar user={user} onLogout={handleLogout} />}
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Error404 />} />
        <Route path="/login" element={<Login setUser={setUser} />} />        <Route path="/verified-email" element={<VerifiedEmail />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </>
  );
}

export default App;