import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProfileInfo from "../components/ProfileInfo";
import OrdersList from "../components/OrdersList";
import "../styles/ProfileInfo.css";
import "../styles/animations.css";

const tabs = [
  { key: "info", label: "Mi Perfil" },
  { key: "orders", label: "Mis Pedidos" },
  { key: "settings", label: "Configuración" },
];

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [userName, setUserName] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabClick = (key: string) => {
    setActiveTab(key);
    setSidebarOpen(false);
  };

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      // Limpiar el token de la URL para que no quede visible
      window.history.replaceState({}, document.title, "/profile");
    }
  }, [location]);

  return (
    <div className="profile-page fade-in">
      <button
        className="sidebar-toggle-btn"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label="Abrir menú"
      >
        <i className="bi bi-list"></i>
      </button>
      <aside className={`profile-sidebar${sidebarOpen ? " open" : ""}`}>
        <h3 className="profile-title">
          <i className="bi bi-person-badge-fill"></i>
          Hola, {userName}
        </h3>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`sidebar-tab${
              activeTab === tab.key ? " active" : ""
            }`}
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </aside>
      <main className="profile-content">
        {activeTab === "info" && (
          <ProfileInfo onUserLoaded={(user) => setUserName(user.nombre)} />
        )}
        {activeTab === "orders" && <OrdersList />}
        {activeTab === "settings" && <div>Configuración de usuario.</div>}
      </main>
    </div>
  );
};

export default ProfilePage;