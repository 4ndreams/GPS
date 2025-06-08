import React, { useState } from "react";
import ProfileInfo from "../components/ProfileInfo";
import "../styles/ProfileInfo.css";

const tabs = [
  { key: "info", label: "Mi Perfil" },
  { key: "orders", label: "Mis Pedidos" },
  { key: "settings", label: "Configuración" },
];

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`sidebar-tab${activeTab === tab.key ? " active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </aside>
      <main className="profile-content">
        {activeTab === "info" && <ProfileInfo />}
        {activeTab === "orders" && <div>Mis pedidos aparecerán aquí.</div>}
        {activeTab === "settings" && <div>Configuración de usuario.</div>}
      </main>
    </div>
  );
};

export default ProfilePage;