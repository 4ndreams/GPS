// src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, AlertTriangle, BarChart3, LogOut, Bell, User, Package, Clock, CheckCircle2, AlertTriangle as AlertTriangleIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

interface Notificacion {
  id: number;
  tipo: string;
  mensaje: string;
  tiempo: string;
  leida: boolean;
  orden?: string;
  fecha_creacion: string;
  prioridad: string;
  resuelta: boolean;
  ordenId?: string; // Added for consistency with other fields
}

export default function Navbar() {
  const { usuario, logout } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const handleLogout = () => {
    logout();
  };

  // Función para obtener notificaciones del backend
  const fetchNotificaciones = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/notificaciones?soloNoLeidas=false');
      if (response.ok) {
        const result = await response.json();
        setNotificaciones(result.data || []);
      }
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
    }
  };

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    fetchNotificaciones();
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchNotificaciones, 30000);
    return () => clearInterval(interval);
  }, []);

  // Función para obtener el icono según el estado
  const getNotificacionIcon = (tipo: string, mensaje: string) => {
    const mensajeLower = mensaje.toLowerCase();
    
    // Estados de producción
    if (mensajeLower.includes('en producción') || mensajeLower.includes('en produccion') || mensajeLower.includes('fabricada')) {
      return <Package className="h-4 w-4 text-orange-600" />
    }
    
    // Estados de tránsito
    if (mensajeLower.includes('en tránsito') || mensajeLower.includes('en transito')) {
      return <Package className="h-4 w-4 text-purple-600" />
    }
    
    // Estados finales exitosos
    if (mensajeLower.includes('recibido') && !mensajeLower.includes('problema')) {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    }
    
    // Estados con problemas
    if (mensajeLower.includes('problema') || mensajeLower.includes('cancelado')) {
      return <AlertTriangleIcon className="h-4 w-4 text-red-600" />
    }
    
    // Estados pendientes
    if (mensajeLower.includes('pendiente')) {
      return <Clock className="h-4 w-4 text-blue-600" />
    }
    
    // Por defecto, gris
    return <Bell className="h-4 w-4 text-gray-600" />
  };



  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;
  
  // Debug: mostrar información de notificaciones
  console.log('Notificaciones totales:', notificaciones.length);
  console.log('Notificaciones no leídas:', notificacionesNoLeidas);
  console.log('Notificaciones:', notificaciones);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div>
          <h1 className="navbar-title">TERPLAC</h1>
          <div className="text-xs text-gray-300">Gestión Fábrica → Tienda</div>
        </div>
      </div>
      
      <div className="navbar-links ml-0">
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

      </div>

      <div className="navbar-actions">
        {/* Notificaciones */}
        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="relative bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Bell className="h-4 w-4 mr-2" />
              <span>Notificaciones</span>
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
                <DropdownMenuItem 
                  key={notif.id} 
                  className={`p-3 ${!notif.leida ? "bg-blue-50" : ""}`}
                  onClick={async () => {
                    if (!notif.leida) {
                      try {
                        const response = await fetch(`http://localhost:3000/api/notificaciones/${notif.id}/leida`, {
                          method: 'PATCH',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                          }
                        });
                        
                        if (response.ok) {
                          // Marcar la notificación como leída localmente
                          setNotificaciones(prevNotificaciones => 
                            prevNotificaciones.map(n => 
                              n.id === notif.id ? { ...n, leida: true } : n
                            )
                          );
                        } else {
                          console.error('Error en la respuesta del servidor:', response.status);
                        }
                      } catch (error) {
                        console.error('Error al marcar notificación como leída:', error);
                      }
                    }
                  }}
                >
                  <div className="flex flex-col space-y-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getNotificacionIcon(notif.tipo, notif.mensaje)}
                        <Badge variant="outline" className="text-xs">
                          {notif.ordenId || notif.orden}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">{notif.tiempo}</span>
                    </div>
                    <p className="text-sm text-black">
                      {notif.mensaje}
                    </p>
                    {!notif.leida && <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto" />}
                  </div>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
            {notificaciones.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={async () => {
                    try {
                      console.log('Marcando todas las notificaciones como leídas...');
                      const response = await fetch('http://localhost:3000/api/notificaciones/todas/leidas', {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                      });
                      
                      if (response.ok) {
                        console.log('Notificaciones marcadas como leídas exitosamente');
                        // Marcar todas las notificaciones como leídas localmente
                        setNotificaciones(prevNotificaciones => 
                          prevNotificaciones.map(notif => ({ ...notif, leida: true }))
                        );
                      } else {
                        console.error('Error en la respuesta del servidor:', response.status);
                      }
                    } catch (error) {
                      console.error('Error al marcar notificaciones como leídas:', error);
                    }
                  }}
                  className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Marcar todas como leídas ({notificacionesNoLeidas} no leídas)
                </DropdownMenuItem>
              </>
            )}
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
