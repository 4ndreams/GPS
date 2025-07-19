import { useState } from 'react';
import { userService, type User as UserType } from '../services/userService';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Trash2,
  AlertTriangle,
  RefreshCw,
  X
} from "lucide-react";

interface DeleteUserDialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly user: UserType | null;
  readonly onUserDeleted: () => void;
}

export default function DeleteUserDialog({ isOpen, onClose, user, onUserDeleted }: DeleteUserDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Confirmar eliminación del usuario
  const handleDelete = async () => {
    if (!user) return;
    
    setDeleting(true);
    setError(null);
    
    try {
      const result = await userService.deleteUser(user.id_usuario);
      
      if (result.success) {
        onUserDeleted();
        onClose();
      } else {
        setError(result.error || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Error de conexión al eliminar usuario');
    } finally {
      setDeleting(false);
    }
  };

  // Helper para el badge del rol
  const getRoleBadgeVariant = (rol: string) => {
    if (rol === 'administrador') return 'default';
    if (rol === 'fabrica') return 'secondary';
    if (rol === 'tienda') return 'outline';
    return 'outline';
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <CardTitle>Eliminar Usuario</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Esta acción no se puede deshacer. El usuario será eliminado permanentemente.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Información del usuario a eliminar */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-red-900">
                  {user.nombre} {user.apellidos}
                </h4>
                <p className="text-sm text-red-700">{user.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-red-600 font-medium">ID:</span>
                <span className="ml-1 font-mono">{user.id_usuario}</span>
              </div>
              <div>
                <span className="text-red-600 font-medium">Rol:</span>
                <Badge variant={getRoleBadgeVariant(user.rol)} className="ml-1 text-xs">
                  {user.rol}
                </Badge>
              </div>
            </div>
          </div>

          {/* Advertencia */}
          <div className="flex items-start space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">¿Estás seguro?</p>
              <p>Se eliminarán todos los datos relacionados con este usuario. Esta acción no se puede revertir.</p>
            </div>
          </div>

          {/* Error si existe */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={deleting}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Usuario
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
