import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Lock } from "lucide-react";

interface UnauthorizedAccessProps {
  message?: string;
  requiredRole?: string;
}

export const UnauthorizedAccess: React.FC<UnauthorizedAccessProps> = ({ 
  message = "No tienes permisos para acceder a esta sección", 
  requiredRole = "Administrador" 
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <div className="relative">
              <Lock className="h-16 w-16 text-red-500 mx-auto" />
              <AlertTriangle className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            Acceso Restringido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            {message}
          </p>
          <p className="text-sm text-gray-500">
            Se requiere rol: <span className="font-medium text-blue-600">{requiredRole}</span>
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              💡 Si crees que esto es un error, contacta al administrador del sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedAccess;
