import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { formatRut, validateField } from '../utils/validations';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  User, 
  Mail,
  Shield,
  Save,
  X,
  RefreshCw,
  AlertTriangle,
  Lock
} from "lucide-react";

interface EditUserDialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly userId: string | null;
  readonly onUserUpdated: () => void;
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

export default function EditUserDialog({ isOpen, onClose, userId, onUserUpdated }: EditUserDialogProps) {
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
  const [loading, setLoading] = useState(false);
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

    // Validar en tiempo real (excepto password que es opcional en edición)
    if (name !== 'password' || value.trim() !== '') {
      const validationError = validateField(name, newValue);
      setValidationErrors(prev => ({
        ...prev,
        [name]: validationError
      }));
    }
  };

  // Cargar datos del usuario cuando se abre el dialog
  const loadUserData = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await userService.getUser(userId);
      
      if (result.success && result.data) {
        const userData = result.data;
        
        // Limpiar RUT quitando puntos
        const cleanRut = (rut: string) => rut ? rut.replace(/\./g, '') : rut;
        
        setFormData({
          nombre: userData.nombre || '',
          apellidos: userData.apellidos || '',
          email: userData.email || '',
          rut: cleanRut(userData.rut || ''), // Limpiar RUT al cargar
          rol: userData.rol || 'cliente',
          password: '', // Siempre vacío por seguridad
          flag_blacklist: userData.flag_blacklist || false
        });
        setValidationErrors({}); // Limpiar errores al cargar
      } else {
        setError(result.error || 'Error al cargar datos del usuario');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Error de conexión al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  // Validar password (solo si se proporciona)
  const validatePassword = (password: string): string | null => {
    if (password.trim() === '') {
      return null; // Password es opcional en edición
    }
    
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    
    return null;
  };

  // Helper para validar todos los campos
  const getValidationErrors = (formData: UserFormData) => {
    return {
      nombre: validateField('nombre', formData.nombre),
      apellidos: validateField('apellidos', formData.apellidos),
      email: validateField('email', formData.email),
      rut: validateField('rut', formData.rut),
      password: validatePassword(formData.password)
    };
  };

  // Helper para manejar errores de actualización
  const handleUpdateError = (result: any) => {
    let errorMessage = result.error || 'Error al actualizar usuario';
    if (result.details) {
      errorMessage = `${errorMessage}: ${result.details}`;
    }
    setError(errorMessage);
  };

  // Helper para manejar errores de excepción
  const handleExceptionError = (error: unknown) => {
    console.error('Error updating user:', error);
    if (error instanceof Error && 'response' in error) {
      const response = (error as any).response;
      if (response?.data?.details) {
        setError(`Error de conexión: ${response.data.details}`);
      } else if (response?.data?.message) {
        setError(`Error de conexión: ${response.data.message}`);
      } else {
        setError('Error de conexión al actualizar usuario');
      }
    } else {
      setError('Error de conexión al actualizar usuario');
    }
  };

  // Guardar cambios del usuario
  const handleSave = async () => {
    if (!userId) return;

    const errors = getValidationErrors(formData);
    const hasErrors = Object.values(errors).some(error => error !== null);
    if (hasErrors) {
      setValidationErrors(errors);
      setError('Por favor corrige los errores en el formulario');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const dataToSend: any = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email,
        rut: formData.rut,
        rol: formData.rol,
        flag_blacklist: formData.flag_blacklist
      };

      if (formData.password.trim() !== '') {
        dataToSend.newPassword = formData.password;
      }

      const result = await userService.updateUser(userId, dataToSend);

      if (result.success) {
        onUserUpdated();
        onClose();
        setValidationErrors({});
      } else {
        handleUpdateError(result);
      }
    } catch (error) {
      handleExceptionError(error);
    } finally {
      setSaving(false);
    }
  };

  // Ejecutar carga cuando se abra el dialog
  useEffect(() => {
    if (isOpen && userId) {
      loadUserData();
    }
  }, [isOpen, userId]);

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
        <Card className="max-h-[80vh] overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Editar Usuario</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                <span>Cargando datos...</span>
              </div>
            )}
            
            {error && !loading && (
              <div className="flex items-center space-x-2 text-red-600 py-4">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            
            {!loading && !error && (
              <>
                {/* Información básica */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="user-nombre" className="text-sm font-medium">Nombre *</label>
                    <Input
                      id="user-nombre"
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
                    <label htmlFor="user-apellidos" className="text-sm font-medium">Apellidos</label>
                    <Input
                      id="user-apellidos"
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
                    <label htmlFor="user-email" className="text-sm font-medium flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email *
                    </label>
                    <Input
                      id="user-email"
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
                    <label htmlFor="user-rut" className="text-sm font-medium">RUT *</label>
                    <Input
                      id="user-rut"
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
                      <span className="text-xs text-gray-500">Rol actual:</span>
                      <Badge variant={getRoleBadgeVariant(formData.rol)} className="text-xs">
                        {formData.rol}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="user-password" className="text-sm font-medium flex items-center">
                      <Lock className="h-4 w-4 mr-1" />
                      Nueva Contraseña (opcional)
                    </label>
                    <Input
                      id="user-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="Dejar vacío para mantener actual"
                      className={validationErrors.password ? 'border-red-500' : ''}
                    />
                    {validationErrors.password && (
                      <span className="text-red-500 text-xs">{validationErrors.password}</span>
                    )}
                    <span className="text-xs text-gray-500">
                      Solo completar si deseas cambiar la contraseña
                    </span>
                  </div>

                  {/* Estado del usuario */}
                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="user-flag_blacklist"
                        checked={formData.flag_blacklist}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, flag_blacklist: !!checked }))
                        }
                      />
                      <label htmlFor="user-flag_blacklist" className="text-sm font-medium text-red-600">
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
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
