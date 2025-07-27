// Interfaces
export interface Material {
  id_material: number;
  nombre_material: string;
  caracteristicas?: string;
}

export interface Relleno {
  id_relleno: number;
  nombre_relleno: string;
  caracteristicas?: string;
}

// Base function for API calls
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(errorData.message ?? 'Error en la petición');
  }

  return response.json();
};

// Materiales
export const obtenerMateriales = async (): Promise<Material[]> => {
  try {
    const result = await apiCall('/materiales');
    // Manejar la estructura de respuesta que puede venir como array anidado
    let data = result.data ?? [];
    
    // Si data es un array y el primer elemento es otro array, extraerlo
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
      data = data[0];
    }
    
    // Filtrar elementos nulos o inválidos
    return Array.isArray(data) ? data.filter(material => material?.id_material) : [];
  } catch (error) {
    console.error('Error al obtener materiales:', error);
    throw new Error('No se pudieron cargar los materiales disponibles');
  }
};

export const obtenerMaterialPorId = async (id: number): Promise<Material | null> => {
  try {
    const result = await apiCall(`/materiales/${id}`);
    // Manejar la estructura de respuesta
    let data = result.data ?? null;
    
    // Si data es un array y el primer elemento es el objeto, extraerlo
    if (Array.isArray(data) && data.length > 0 && data[0]?.id_material) {
      data = data[0];
    }
    
    return data?.id_material ? data : null;
  } catch (error) {
    console.error(`Error al obtener material ${id}:`, error);
    return null;
  }
};

// Rellenos
export const obtenerRellenos = async (): Promise<Relleno[]> => {
  try {
    const result = await apiCall('/rellenos');
    // Manejar la estructura de respuesta que puede venir como array anidado
    let data = result.data ?? [];
    
    // Si data es un array y el primer elemento es otro array, extraerlo
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
      data = data[0];
    }
    
    // Filtrar elementos nulos o inválidos
    return Array.isArray(data) ? data.filter(relleno => relleno?.id_relleno) : [];
  } catch (error) {
    console.error('Error al obtener rellenos:', error);
    throw new Error('No se pudieron cargar los rellenos disponibles');
  }
};

export const obtenerRellenoPorId = async (id: number): Promise<Relleno | null> => {
  try {
    const result = await apiCall(`/rellenos/${id}`);
    // Manejar la estructura de respuesta
    let data = result.data ?? null;
    
    // Si data es un array y el primer elemento es el objeto, extraerlo
    if (Array.isArray(data) && data.length > 0 && data[0]?.id_relleno) {
      data = data[0];
    }
    
    return data?.id_relleno ? data : null;
  } catch (error) {
    console.error(`Error al obtener relleno ${id}:`, error);
    return null;
  }
};
