import { useState, useEffect } from 'react';
import { userService, type User as UserType } from '../services/userService';
import UserDetailsDialog from './UserDetailsDialog';
import EditUserDialog from './EditUserDialog';
import DeleteUserDialog from './DeleteUserDialog';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  RefreshCw,
  User,
  Users,
  Settings,
  Eye,
  MoreHorizontal,
  XCircle,
  Search,
  Filter,
} from "lucide-react";

export default function UsersManagement() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Estados para popups
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // Helper para verificar si hay filtros activos
  const hasActiveFilters = searchTerm || (selectedRole !== '' && selectedRole !== 'todos') || (selectedStatus !== '' && selectedStatus !== 'todos');

  // Helper function para determinar la variante del badge del rol
  const getRoleBadgeVariant = (rol: string) => {
    if (rol === 'administrador') return 'default';
    if (rol === 'fabrica') return 'secondary';
    if (rol === 'tienda') return 'outline';
    return 'outline'; // para 'cliente'
  };

  // Función para filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === '' || selectedRole === 'todos' || user.rol === selectedRole;
    
    const userStatus = !user.flag_blacklist && user.correoVerificado ? 'activo' : 'inactivo';
    const matchesStatus = selectedStatus === '' || selectedStatus === 'todos' || userStatus === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
    setSelectedStatus('');
  };

  // Funciones para manejar popups
  const handleViewDetails = (user: UserType) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
  };

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleDeleteUser = (user: UserType) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleUserUpdated = () => {
    loadUsers(); // Recargar usuarios después de editar
    setShowEditDialog(false);
    setSelectedUser(null);
  };

  const handleUserDeleted = () => {
    loadUsers(); // Recargar usuarios después de eliminar
    setShowDeleteDialog(false);
    setSelectedUser(null);
  };

  // Función para cargar usuarios
  const loadUsers = async () => {
    setLoadingUsers(true);
    setUsersError(null);
    
    try {
      const result = await userService.getUsers();
      
      if (result.success && result.data) {
        setUsers(result.data);
      } else {
        setUsersError(result.error || 'Error al cargar usuarios');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsersError('Error de conexión al cargar usuarios');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Administración de Usuarios</h2>
          <p className="text-gray-600">Configura a los usuarios del sistema</p>
        </div>
        <Button onClick={loadUsers} disabled={loadingUsers}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loadingUsers ? "animate-spin" : ""}`} />
          {loadingUsers ? "Cargando..." : "Actualizar"}
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros de Búsqueda</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda por texto */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Buscar</div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nombre, apellido o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtro por rol */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Rol</div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los roles</SelectItem>
                  <SelectItem value="administrador">Administrador</SelectItem>
                  <SelectItem value="fabrica">Fábrica</SelectItem>
                  <SelectItem value="tienda">Tienda</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por estado */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Estado</div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botón para limpiar filtros */}
            <div className="space-y-2">
              <div className="text-sm font-medium opacity-0">Acciones</div>
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="w-full"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Limpiar Filtros
              </Button>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="mt-4 text-sm text-gray-600">
            Mostrando {filteredUsers.length} de {users.length} usuarios
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
          <CardDescription>
            Lista de todos los usuarios registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersError && (
            <div className="flex items-center space-x-2 text-red-600 mb-4">
              <AlertTriangle className="h-4 w-4" />
              <span>{usersError}</span>
            </div>
          )}

          {loadingUsers ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Cargando usuarios...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellido</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        {users.length === 0 
                          ? "No hay usuarios disponibles. Haz clic en 'Actualizar' para cargar los usuarios."
                          : "No se encontraron usuarios que coincidan con los filtros aplicados."
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id_usuario} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{user.id_usuario}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <span>{user.nombre}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.apellidos || 'No especificado'}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.rol)}>
                            {user.rol}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={!user.flag_blacklist && user.correoVerificado ? 'default' : 'destructive'}
                            className={
                              !user.flag_blacklist && user.correoVerificado
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {!user.flag_blacklist && user.correoVerificado ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Settings className="h-4 w-4 mr-2" />
                                Editar Usuario
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Eliminar Usuario
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tienda</CardTitle>
            <User className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {filteredUsers.filter(u => u.rol === 'tienda').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Usuarios de tienda{hasActiveFilters ? ' (filtrados)' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fábrica</CardTitle>
            <Settings className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {filteredUsers.filter(u => u.rol === 'fabrica').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Usuarios de fábrica{hasActiveFilters ? ' (filtrados)' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {filteredUsers.filter(u => u.rol === 'administrador').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Con permisos de administración{hasActiveFilters ? ' (filtrados)' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs para popup */}
      {selectedUser && (
        <UserDetailsDialog
          isOpen={showDetailsDialog}
          onClose={() => {
            setShowDetailsDialog(false);
            setSelectedUser(null);
          }}
          userId={selectedUser.id_usuario}
        />
      )}

      {selectedUser && (
        <EditUserDialog
          isOpen={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setSelectedUser(null);
          }}
          userId={selectedUser.id_usuario}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {selectedUser && (
        <DeleteUserDialog
          isOpen={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onUserDeleted={handleUserDeleted}
        />
      )}
    </div>
  );
}
