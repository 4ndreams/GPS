import { useState, useEffect } from 'react';
import { userService, type User as UserType } from '../services/userService';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  X
} from "lucide-react";

interface UserDetailsDialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly userId: string | null;
}

export default function UserDetailsDialog({ isOpen, onClose, userId }: UserDetailsDialogProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar detalles del usuario cuando se abre el dialog
  const loadUserDetails = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await userService.getUser(userId);
      
      if (result.success && result.data) {
        setUser(result.data);
      } else {
        setError(result.error || 'Error al cargar detalles del usuario');
      }
    } catch (error) {
      console.error('UserDetailsDialog - Error en la carga:', error);
      setError('Error de conexión al cargar detalles');
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar carga cuando se abra el dialog
  useEffect(() => {
    if (isOpen && userId) {
      loadUserDetails();
    }
  }, [isOpen, userId]);

  // Helper para determinar el estado del usuario
  const getUserStatus = () => {
    if (!user) return { text: 'Desconocido', variant: 'secondary' };
    
    const isActive = !user.flag_blacklist && user.correoVerificado;
    return {
      text: isActive ? 'Activo' : 'Inactivo',
      variant: isActive ? 'default' : 'destructive'
    };
  };

  // Helper para el badge del rol
  const getRoleBadgeVariant = (rol: string) => {
    if (rol === 'administrador') return 'default';
    if (rol === 'fabrica') return 'secondary';
    if (rol === 'bodega') return 'outline';
    return 'outline';
  };

  // Renderizar contenido principal
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Cargando detalles...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center space-x-2 text-red-600 py-4">
          <AlertTriangle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      );
    }

    if (!user) return null;

    const status = getUserStatus();

    return (
      <div className="space-y-4">
        {/* Información básica */}
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">ID:</span>
              <span className="font-mono text-sm">{user.id_usuario}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Nombre:</span>
              <span>{user.nombre}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Apellidos:</span>
              <span>{user.apellidos || 'No especificado'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Email:
              </span>
              <span className="text-sm">{user.email}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">RUT:</span>
              <span>{user.rut || 'No especificado'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Rol y estado */}
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                Rol:
              </span>
              <Badge variant={getRoleBadgeVariant(user.rol)}>
                {user.rol}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Estado:</span>
              <Badge 
                variant={status.variant as "default" | "destructive" | "secondary" | "outline"}
                className={
                  status.variant === 'default'
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }
              >
                {status.text}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Email Verificado:</span>
              <div className="flex items-center space-x-1">
                {user.correoVerificado ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">
                  {user.correoVerificado ? 'Verificado' : 'No verificado'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Bloqueado:</span>
              <div className="flex items-center space-x-1">
                {user.flag_blacklist ? (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
                <span className="text-sm">
                  {user.flag_blacklist ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
            
            {user.createdAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Creado:
                </span>
                <span className="text-sm">
                  {new Date(user.createdAt).toLocaleDateString('es-ES')}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-md w-full mx-4">
            <Card className="max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Detalles del Usuario</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderContent()}
                <div className="flex justify-end pt-4">
                  <Button variant="outline" onClick={onClose}>
                    Cerrar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
