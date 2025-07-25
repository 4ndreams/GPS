// src/components/Navbar.tsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, AlertTriangle, BarChart3, LogOut, Search, Bell, User, Settings, Download } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
  };

  // Datos de notificaciones (simulados)
  const notificaciones = [
    {
      id: 1,
      tipo: "alerta_faltante",
      mensaje: "Orden OD-2025-002: Faltan 3 puertas MDF modelo PM-002",
      tiempo: "hace 15 min",
      leida: false,
      orden: "OD-2025-002",
    },
    {
      id: 2,
      tipo: "rechazo_calidad",
      mensaje: "Orden OD-2025-005: Rechazada por defectos de calidad",
      tiempo: "hace 1 hora",
      leida: false,
      orden: "OD-2025-005",
    },
  ];

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div>
          <h1 className="navbar-title">TERPLAC</h1>
          <div className="text-xs text-gray-300">Gestión Fábrica → Tienda</div>
        </div>
      </div>
      
      <div className="navbar-links">
        <NavLink to="/" className="nav-link" end>
          <Home className="nav-icon" />
          <span>Administración</span>
        </NavLink>
        <NavLink to="/ordenes" className="nav-link">
          <AlertTriangle className="nav-icon" />
          <span>Órdenes</span>
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
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-48 md:w-60 lg:w-72 bg-white/10 border-white/20 text-white placeholder-white/70 focus:text-white"
          />
        </div>

        {/* Notificaciones */}
        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="relative bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Bell className="h-4 w-4" />
              {notificacionesNoLeidas > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                  {notificacionesNoLeidas}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80" side="bottom">
            <DropdownMenuLabel>Notificaciones de Fábrica</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-64">
              {notificaciones.map((notif) => (
                <DropdownMenuItem key={notif.id} className={`p-3 ${!notif.leida ? "bg-blue-50" : ""}`}>
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
          <DropdownMenuContent side="bottom">
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
              <span className="hidden sm:inline">{usuario?.nombre ? usuario.nombre.split(' ')[0] : 'Usuario'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" side="bottom">
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
