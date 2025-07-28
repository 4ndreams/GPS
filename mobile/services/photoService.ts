import api from './api';

export interface Photo {
  id_photo: number; // Mantenemos este nombre para consistencia interna
  id_pht?: number;  // Campo original del backend
  id_orden: number;
  ruta_imagen: string;
  nombre_archivo?: string;
  created_at?: string;
}

export const PhotoService = {
  // Obtener todas las fotos de una orden específica
  async getPhotosByOrderId(id_orden: number): Promise<Photo[]> {
    try {
      console.log('🔍 Obteniendo fotos para la orden:', id_orden);
      
      // Usar el endpoint que sabemos que funciona
      console.log('🔄 Usando endpoint: /photo?id_orden=' + id_orden);
      const response = await api.get(`/photo?id_orden=${id_orden}`);
      console.log('✅ Respuesta de la API:', response.data);
      
      let photos: Photo[] = [];
      
      // Verificar la estructura de respuesta que conocemos
      if (response.data.status === 'Success' && response.data.data) {
        photos = response.data.data;
      } else if (response.data.success && response.data.data) {
        photos = response.data.data;
      } else if (response.data.data) {
        photos = response.data.data;
      } else if (Array.isArray(response.data)) {
        photos = response.data;
      } else {
        console.warn('⚠️ Estructura de respuesta no reconocida para orden:', id_orden);
        return [];
      }
      
      // Filtrar y mapear por id_orden
      if (Array.isArray(photos)) {
        const filteredPhotos = photos
          .filter(photo => {
            if (photo && typeof photo === 'object' && 'id_orden' in photo) {
              return Number(photo.id_orden) === Number(id_orden);
            }
            return false;
          })
          .map(photo => ({
            // Mapear la estructura del backend a nuestra interfaz
            id_photo: photo.id_pht || photo.id_photo, // Usar id_pht del backend
            id_pht: photo.id_pht,
            id_orden: photo.id_orden,
            ruta_imagen: photo.ruta_imagen,
            nombre_archivo: photo.nombre_archivo,
            created_at: photo.created_at
          }));
        photos = filteredPhotos;
      }
      
      console.log('✅ Fotos procesadas y filtradas:', photos.length);
      photos.forEach((photo, index) => {
        console.log(`📷 Foto ${index + 1}:`, {
          id_photo: photo.id_photo,
          id_pht: photo.id_pht,
          id_orden: photo.id_orden,
          ruta_imagen: photo.ruta_imagen
        });
      });
      
      return photos;
    } catch (error: any) {
      console.error('❌ Error obteniendo fotos:', error);
      console.error('📡 Error response:', error.response?.data);
      console.error('📡 Error status:', error.response?.status);
      
      // Si el error es 404, significa que no hay fotos, no es un error crítico
      if (error.response?.status === 404) {
        console.log('📷 No hay fotos disponibles para esta orden (404)');
        return [];
      }
      
      // Para otros errores, también retornamos array vacío para no romper la UI
      console.log('🔄 Retornando array vacío para evitar errores en UI');
      return [];
    }
  },

  // Obtener una foto específica por ID
  async getPhotoById(id_photo: number): Promise<Photo | null> {
    try {
      console.log('🔍 Obteniendo foto por ID:', id_photo);
      const response = await api.get(`/photo/${id_photo}`);
      
      if (response.data.success) {
        console.log('✅ Foto encontrada:', response.data.data);
        return response.data.data;
      } else {
        console.warn('⚠️ No se encontró la foto con ID:', id_photo);
        return null;
      }
    } catch (error: any) {
      console.error('❌ Error obteniendo foto por ID:', error);
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Subir una nueva foto (ya existe en dashboard-fabrica, pero lo extraemos aquí)
  async uploadPhoto(uri: string, id_orden: number): Promise<string> {
    try {
      console.log('=== SUBIENDO IMAGEN ===');
      console.log('📁 URI:', uri);
      console.log('🏷️ ID Orden:', id_orden);

      const formData = new FormData();
      
      // Crear el objeto del archivo
      const fileObject = {
        uri: uri,
        type: 'image/jpeg', // Tipo MIME
        name: `orden_${id_orden}_${Date.now()}.jpg`, // Nombre único
      } as any;

      formData.append('file', fileObject);
      formData.append('id_orden', id_orden.toString());

      const response = await api.post('/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data || (!response.data.success && response.status !== 201)) {
        const errorText = JSON.stringify(response.data);
        throw new Error(`Error al subir imagen: ${response.status} - ${errorText}`);
      }

      const data = response.data;
      console.log('Imagen subida exitosamente:', data);

      // Retornar la URL de la imagen
      return data.data?.ruta_imagen || data.ruta_imagen || '';
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }
  }
};
