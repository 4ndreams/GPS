import { useState, useEffect } from 'react';
import { PhotoService, Photo } from '../services/photoService';

export const useOrderPhotos = (id_orden: number | null) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!id_orden) {
        setPhotos([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const photosData = await PhotoService.getPhotosByOrderId(id_orden);
        setPhotos(photosData);
      } catch (err: any) {
        console.error('Error loading photos:', err);
        setError(err.message || 'Error al cargar las fotos');
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [id_orden]);

  const refreshPhotos = async () => {
    if (!id_orden) return;
    
    try {
      setLoading(true);
      setError(null);
      const photosData = await PhotoService.getPhotosByOrderId(id_orden);
      setPhotos(photosData);
    } catch (err: any) {
      console.error('Error refreshing photos:', err);
      setError(err.message || 'Error al refrescar las fotos');
    } finally {
      setLoading(false);
    }
  };

  return {
    photos,
    loading,
    error,
    refreshPhotos,
    hasPhotos: photos.length > 0,
    photoCount: photos.length,
    firstPhoto: photos.length > 0 ? photos[0] : null,
  };
};
