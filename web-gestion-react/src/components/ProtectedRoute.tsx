import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: 'administrador' | 'fabrica' | 'tienda';
  allowedRoles?: Array<'administrador' | 'fabrica' | 'tienda'>;
}

export default function ProtectedRoute({ 
  children, 
  requireRole,
  allowedRoles = ['administrador', 'fabrica', 'tienda'] 
}: Readonly<ProtectedRouteProps>) {
  const { isAuthenticated, usuario, logout } = useAuth();
  const location = useLocation();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated || !usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // BLOQUEO TOTAL PARA CLIENTES - Los clientes NO pueden acceder al sistema de gestión
  if (usuario.rol === 'cliente') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <div className="relative">
                <Lock className="h-16 w-16 text-red-500 mx-auto" />
                <AlertTriangle className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1" />
              </div>
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Acceso Denegado - Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Los clientes no tienen acceso al sistema de gestión interno.
            </p>
            <p className="text-sm text-gray-500">
              Este sistema está reservado para personal autorizado (administradores, fábrica y tienda).
            </p>
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Tu rol:</strong> Cliente<br/>
              </p>
            </div>
            <Button 
              onClick={logout}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar si el usuario está bloqueado
  if (usuario.flag_blacklist === true) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <div className="relative">
                <Lock className="h-16 w-16 text-red-500 mx-auto" />
                <AlertTriangle className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1" />
              </div>
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Cuenta Bloqueada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Tu cuenta ha sido bloqueada. Contacta al administrador para más información.
            </p>
            <Button 
              onClick={logout}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  if (requireRole && usuario?.rol !== requireRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <Lock className="h-16 w-16 text-red-500 mx-auto" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Acceso Restringido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              No tienes permisos para acceder a esta sección específica.
            </p>
            <p className="text-sm text-gray-500">
              Se requiere rol: <span className="font-medium">{requireRole}</span>
            </p>
            <p className="text-sm text-gray-500">
              Tu rol actual: <span className="font-medium">{usuario?.rol}</span>
            </p>
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar roles permitidos (para compatibilidad)
  if (!allowedRoles.includes(usuario.rol as any)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <Lock className="h-16 w-16 text-red-500 mx-auto" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Acceso Denegado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              No tienes permisos para acceder a esta área del sistema.
            </p>
            <p className="text-sm text-gray-500">
              Tu rol actual: <span className="font-semibold capitalize">{usuario.rol}</span>
            </p>
            <p className="text-sm text-gray-500">
              Roles permitidos: {allowedRoles.join(', ')}
            </p>
            <Button 
              onClick={logout}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
