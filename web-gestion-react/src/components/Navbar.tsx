// src/components/Navbar.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, AlertTriangle, BarChart3, LogOut, Search, Bell, User, Settings, Download, RefreshCw, Package } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotificaciones } from '../hooks/useNotificaciones';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import './Navbar.css';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const { notificaciones, cantidadNoLeidas, marcarComoLeida } = useNotificaciones();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleNotificacionClick = async (notif: { id: number; leida: boolean }) => {
    if (!notif.leida) {
      await marcarComoLeida(notif.id);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div>
          <h1 className="navbar-title">TERPLAC - Mundo Puertas</h1>
          <div className="text-xs text-gray-300">Gestión Fábrica → Tienda</div>
        </div>
      </div>
      
      <div className="navbar-links">
        <NavLink to="/" className="nav-link" end>
          <Home className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/ordenes" className="nav-link">
          <AlertTriangle className="nav-icon" />
          <span>Órdenes</span>
        </NavLink>
        <NavLink to="/productos" className="nav-link">
          <Package className="nav-icon" />
          <span>Productos</span>
        </NavLink>
        <NavLink to="/reportes" className="nav-link">
          <BarChart3 className="nav-icon" />
          <span>Reportes</span>
        </NavLink>
        <NavLink to="/configuracion" className="nav-link">
          <Settings className="nav-icon" />
          <span>Configuración</span>
        </NavLink>
      </div>

      <div className="navbar-actions">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por orden, trabajador, producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-80 bg-white/10 border-white/20 text-white placeholder-white/70 focus:text-white"
          />
        </div>

        {/* Sincronizar */}
        <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          <RefreshCw className="h-4 w-4 mr-1" />
          Sincronizar
        </Button>

        {/* Notificaciones */}
        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="relative bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Bell className="h-4 w-4" />
              {cantidadNoLeidas > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                  {cantidadNoLeidas}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificaciones de Fábrica</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-64">
              {notificaciones.map((notif) => (
                <DropdownMenuItem 
                  key={notif.id} 
                  className={`p-3 ${!notif.leida ? "bg-blue-50" : ""}`}
                  onClick={() => handleNotificacionClick(notif)}
                >
                  <div className="flex flex-col space-y-1 w-full">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {notif.orden}
                      </Badge>
                      <span className="text-xs text-gray-500">{notif.tiempo}</span>
                    </div>
                    <p className="text-sm">{notif.mensaje}</p>
                    {!notif.leida && <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto" />}
                  </div>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Exportar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Download className="h-4 w-4 mr-1" />
              Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Excel (.xlsx)</DropdownMenuItem>
            <DropdownMenuItem>PDF</DropdownMenuItem>
            <DropdownMenuItem>CSV</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Menú de Usuario */}
        <DropdownMenu open={showUserMenu} onOpenChange={setShowUserMenu}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{usuario?.nombre || 'Usuario'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-sm text-gray-500">
              <div className="font-medium">{usuario?.nombre || 'Usuario'}</div>
              <div className="text-xs">{usuario?.email || 'usuario@terplac.com'}</div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
