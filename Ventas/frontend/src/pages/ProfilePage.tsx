import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProfileInfo from "@components/ProfileInfo";
import ProductManagement from "@components/ProductManagement";
import MisCotizaciones from "@components/MisCotizaciones.tsx";
import UserTable from "@components/UserTable";
import { TokenService } from '@services/tokenService';
import "@styles/ProfileInfo.css";
import "@styles/animations.css";

const dinamicTabs = (role: string) => {
  if (role.toLowerCase() === "administrador") {
    return [
      { key: "info", label: "Mi Perfil" },
      { key: "orders", label: "Mis Compras" },
      { key: "cotizaciones", label: "Mis Cotizaciones" },
      { key: "products", label: "Gestión de Productos" },
      { key: "users", label: "Usuarios del sistema" },
    ];
  }

  return [
    { key: "info", label: "Mi Perfil" },
    { key: "orders", label: "Mis Compras" },
    { key: "cotizaciones", label: "Mis Cotizaciones" },
  ];
};

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabClick = (key: string) => {
    setActiveTab(key);
    setSidebarOpen(false);
  };

  const location = useLocation();

    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const urlToken = params.get("token");

    if (urlToken) {
      TokenService.setToken(urlToken);
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

        {dinamicTabs(userRole).map((tab) => (
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
          <ProfileInfo
            onUserLoaded={(user) => {
              setUserName(user.nombre);
              setUserRole(user.rol);
            }}
          />
        )}

        {activeTab === "products" &&
          userRole.toLowerCase() === "administrador" && (
            <ProductManagement userRole={userRole} token={TokenService.getToken() ?? ""} />
          )}

        {activeTab === "users" &&
          userRole.toLowerCase() === "administrador" && (
            <UserTable/>
          )}

        {activeTab === "orders" && <div>No se han realizado compras aún.</div>}

        {activeTab === "cotizaciones" && <MisCotizaciones />}

      </main>
    </div>
  );
};

export default ProfilePage;
