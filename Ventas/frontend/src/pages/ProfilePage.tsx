import React, { useState } from "react";
import ProfileInfo from "../components/ProfileInfo";
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
            className={`sidebar-tab${activeTab === tab.key ? " active" : ""}`}
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </aside>
      <main className="profile-content">
        {activeTab === "info" && (
          <ProfileInfo onUserLoaded={user => setUserName(user.nombre)} />
        )}
        {activeTab === "orders" && <div>Mis pedidos aparecerán aquí.</div>}
        {activeTab === "settings" && <div>Configuración de usuario.</div>}
      </main>
    </div>
  );
};

export default ProfilePage;