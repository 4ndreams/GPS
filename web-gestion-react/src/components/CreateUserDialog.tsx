import { useState } from 'react';
import { userService } from '../services/userService';
import { formatRut, validateField } from '../utils/validations';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  UserPlus, 
  Mail,
  Shield,
  Save,
  X,
  RefreshCw,
  AlertTriangle,
  Lock
} from "lucide-react";

interface CreateUserDialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onUserCreated: () => void;
}

interface UserFormData {
  nombre: string;
  apellidos: string;
  email: string;
  rut: string;
  rol: 'cliente' | 'fabrica' | 'tienda' | 'administrador';
  password: string;
  flag_blacklist: boolean;
}

export default function CreateUserDialog({ isOpen, onClose, onUserCreated }: CreateUserDialogProps) {
  const [formData, setFormData] = useState<UserFormData>({
    nombre: '',
    apellidos: '',
    email: '',
    rut: '',
    rol: 'cliente',
    password: '',
    flag_blacklist: false
  });
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string | null}>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para manejar cambios con validación en tiempo real
  const handleChange = (name: string, value: string) => {
    let newValue = value;

    // Formateo especial para el RUT
    if (name === 'rut') {
      newValue = formatRut(value);
      
      // Limitar a 10 caracteres máximo (8 dígitos + guión + 1 dígito verificador)
      if (newValue.length > 10) {
        newValue = newValue.substring(0, 10);
      }
    }

    // Actualizar el estado del formulario
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Validar en tiempo real
    const validationError = validateField(name, newValue);
    setValidationErrors(prev => ({
      ...prev,
      [name]: validationError
    }));
  };

  // Validar password (requerido para creación)
  const validatePassword = (password: string): string | null => {
    if (password.trim() === '') {
      return 'La contraseña es requerida';
    }
    
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    
    return null;
  };

  // Validar apellidos
  const validateApellidos = (apellidos: string): string | null => {
    if (apellidos.trim() === '') {
      return 'Los apellidos son requeridos';
    }
    
    if (apellidos.length < 2) {
      return 'Los apellidos deben tener al menos 2 caracteres';
    }
    
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellidos)) {
      return 'Los apellidos solo pueden contener letras y espacios';
    }
    
    return null;
  };

  // Crear usuario
  const handleSave = async () => {
    // Validar todos los campos antes de enviar
    const errors: {[key: string]: string | null} = {};
    errors.nombre = validateField('nombre', formData.nombre);
    errors.apellidos = validateApellidos(formData.apellidos);
    errors.email = validateField('email', formData.email);
    errors.rut = validateField('rut', formData.rut);
    errors.password = validatePassword(formData.password);

    // Verificar si hay errores
    const hasErrors = Object.values(errors).some(error => error !== null);
    if (hasErrors) {
      setValidationErrors(errors);
      setError('Por favor corrige los errores en el formulario');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      const result = await userService.createUser(formData);
      
      if (result.success) {
        onUserCreated();
        onClose();
        // Limpiar formulario
        setFormData({
          nombre: '',
          apellidos: '',
          email: '',
          rut: '',
          rol: 'cliente',
          password: '',
          flag_blacklist: false
        });
        setValidationErrors({});
      } else {
        // Mostrar error con detalles si están disponibles
        let errorMessage = result.error || 'Error al crear usuario';
        
        // Si hay detalles adicionales del servidor, incluirlos
        if (result.details) {
          errorMessage = `${errorMessage}: ${result.details}`;
        }
        
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      
      // Verificar si el error tiene una respuesta del servidor con detalles
      if (error instanceof Error && 'response' in error) {
        const response = (error as any).response;
        if (response?.data?.details) {
          setError(`Error de conexión: ${response.data.details}`);
        } else if (response?.data?.message) {
          setError(`Error de conexión: ${response.data.message}`);
        } else {
          setError('Error de conexión al crear usuario');
        }
      } else {
        setError('Error de conexión al crear usuario');
      }
    } finally {
      setSaving(false);
    }
  };

  // Helper para el badge del rol
  const getRoleBadgeVariant = (rol: string) => {
    if (rol === 'administrador') return 'default';
    if (rol === 'fabrica') return 'secondary';
    if (rol === 'tienda') return 'outline';
    return 'outline';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4">
        <Card className="max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5" />
                <span>Crear Nuevo Usuario</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center space-x-2 text-red-600 py-4">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            
            {/* Información básica */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="create-user-nombre" className="text-sm font-medium">Nombre *</label>
                <Input
                  id="create-user-nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Nombre del usuario"
                  className={validationErrors.nombre ? 'border-red-500' : ''}
                />
                {validationErrors.nombre && (
                  <span className="text-red-500 text-xs">{validationErrors.nombre}</span>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="create-user-apellidos" className="text-sm font-medium">Apellidos *</label>
                <Input
                  id="create-user-apellidos"
                  value={formData.apellidos}
                  onChange={(e) => handleChange('apellidos', e.target.value)}
                  placeholder="Apellidos del usuario"
                  className={validationErrors.apellidos ? 'border-red-500' : ''}
                />
                {validationErrors.apellidos && (
                  <span className="text-red-500 text-xs">{validationErrors.apellidos}</span>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="create-user-email" className="text-sm font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  Email *
                </label>
                <Input
                  id="create-user-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@ejemplo.com"
                  className={validationErrors.email ? 'border-red-500' : ''}
                />
                {validationErrors.email && (
                  <span className="text-red-500 text-xs">{validationErrors.email}</span>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="create-user-rut" className="text-sm font-medium">RUT *</label>
                <Input
                  id="create-user-rut"
                  value={formData.rut}
                  onChange={(e) => handleChange('rut', e.target.value)}
                  placeholder="12345678-9"
                  maxLength={10}
                  className={validationErrors.rut ? 'border-red-500' : ''}
                />
                {validationErrors.rut && (
                  <span className="text-red-500 text-xs">{validationErrors.rut}</span>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Rol *
                </label>
                <Select 
                  value={formData.rol} 
                  onValueChange={(value: 'cliente' | 'fabrica' | 'tienda' | 'administrador') => 
                    setFormData(prev => ({ ...prev, rol: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="fabrica">Fábrica</SelectItem>
                    <SelectItem value="tienda">Tienda</SelectItem>
                    <SelectItem value="administrador">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500">Rol seleccionado:</span>
                  <Badge variant={getRoleBadgeVariant(formData.rol)} className="text-xs">
                    {formData.rol}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="create-user-password" className="text-sm font-medium flex items-center">
                  <Lock className="h-4 w-4 mr-1" />
                  Contraseña *
                </label>
                <Input
                  id="create-user-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className={validationErrors.password ? 'border-red-500' : ''}
                />
                {validationErrors.password && (
                  <span className="text-red-500 text-xs">{validationErrors.password}</span>
                )}
              </div>

              {/* Estado del usuario */}
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="create-user-flag_blacklist"
                    checked={formData.flag_blacklist}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, flag_blacklist: !!checked }))
                    }
                  />
                  <label htmlFor="create-user-flag_blacklist" className="text-sm font-medium text-red-600">
                    Usuario bloqueado
                  </label>
                </div>
                {formData.flag_blacklist && (
                  <div className="text-xs text-red-500 ml-6">
                    El usuario no podrá iniciar sesión mientras esté bloqueado
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose} disabled={saving}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Crear Usuario
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
