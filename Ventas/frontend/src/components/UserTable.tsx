import { useEffect, useState } from "react";
import axios from "axios";
import "@styles/userTable.css";
import tokenService from "../services/tokenService";

interface Usuario {
  rut: string;
  nombre: string;
  apellidos: string;
  email: string;
  rol: string;
}

const UsersTable = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    rut: "",
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    rol: "cliente",
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);

  const validateCreateForm = () => {
    if (
      !createForm.rut.trim() ||
      !createForm.nombre.trim() ||
      !createForm.apellidos.trim() ||
      !createForm.email.trim() ||
      !createForm.password.trim() ||
      !createForm.rol.trim()
    ) {
      setCreateError("Todos los campos son obligatorios.");
      return false;
    }

    if (!/^\d{7,8}-[\dkK]$/.test(createForm.rut)) {
      setCreateError("El RUT no es válido. Formato esperado: 23583318-2");
      return false;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(createForm.email)) {
      setCreateError("El email no es válido.");
      return false;
    }

    setCreateError(null);
    return true;
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCreateForm()) return;

    setCreateLoading(true);
    const token = tokenService.getToken();

    if (!token) {
      setCreateError("No tienes permisos. Inicia sesión como administrador.");
      setCreateLoading(false);
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users`,
        createForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowCreateModal(false);
      setCreateForm({
        rut: "",
        nombre: "",
        apellidos: "",
        email: "",
        password: "",
        rol: "cliente",
      });
      setCreateError(null);

      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data);
    } catch (err: any) {
      setCreateError(err?.response?.data?.message || "Error al crear usuario.");
    } finally {
      setCreateLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = tokenService.getToken();
    if (!token) {
      setError("No se encontró token de autenticación. Por favor, inicia sesión.");
      setLoading(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          setError("Token inválido o expirado. Por favor, inicia sesión nuevamente.");
          tokenService.removeToken();
        } else {
          setError(err.response?.data?.message || "Error al cargar usuarios.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-table-wrapper">
      <button className="btn-create-user" onClick={() => setShowCreateModal(true)}>Crear nuevo usuario</button>

      <table className="user-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Rut</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.rut || user.email}>
              <td>{user.nombre}</td>
              <td>{user.apellidos}</td>
              <td>{user.email}</td>
              <td>{user.rut}</td>
              <td>{user.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowCreateModal(false)}>
              ×
            </button>
            <h3>Crear nuevo usuario</h3>
            <form onSubmit={handleCreateUser} className="create-user-form">
              <label>
                RUT
                <input
                  type="text"
                  value={createForm.rut}
                  onChange={(e) => setCreateForm((f) => ({ ...f, rut: e.target.value }))}
                  required
                  placeholder="Ej: 23583318-2"
                />
              </label>

              <label>
                Nombre
                <input
                  type="text"
                  value={createForm.nombre}
                  onChange={(e) => setCreateForm((f) => ({ ...f, nombre: e.target.value }))}
                  required
                  placeholder="Nombre(s)"
                />
              </label>

              <label>
                Apellidos
                <input
                  type="text"
                  value={createForm.apellidos}
                  onChange={(e) => setCreateForm((f) => ({ ...f, apellidos: e.target.value }))}
                  required
                  placeholder="Apellidos"
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  placeholder="ejemplo@correo.com"
                />
              </label>

              <label>
                Contraseña
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                  required
                  placeholder="Contraseña"
                />
              </label>

              <label>
                Rol
                <select
                  value={createForm.rol}
                  onChange={(e) => setCreateForm((f) => ({ ...f, rol: e.target.value }))}
                  required
                >
                  <option value="cliente">Cliente</option>
                  <option value="fabrica">Fabrica</option>
                  <option value="tienda">Tienda</option>
                </select>
              </label>

              {createError && <p className="error-message">{createError}</p>}

              <button type="submit" disabled={createLoading} className="btn-primary">
                {createLoading ? "Creando..." : "Crear usuario"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
