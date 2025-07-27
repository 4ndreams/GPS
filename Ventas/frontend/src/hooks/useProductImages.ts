import { useState, useRef } from 'react';

interface UseProductImagesReturn {
  imagenes: File[];
  imagenesPreview: string[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImagenesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImagen: (index: number) => void;
  clearImagenes: () => void;
  addImagenes: (files: File[]) => void;
}

export const useProductImages = (): UseProductImagesReturn => {
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [imagenesPreview, setImagenesPreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImagenesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validar límite de 10 imágenes
    if (imagenes.length + files.length > 10) {
      alert('Máximo 10 imágenes permitidas');
      return;
    }

    // Validar tipos de archivo
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      alert('Solo se permiten archivos de imagen');
    }

    setImagenes(prev => [...prev, ...validFiles]);

    // Crear previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagenesPreview(prev => [...prev, ...newPreviews]);
  };

  const removeImagen = (index: number) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
    
    // Revocar URL del preview para liberar memoria
    URL.revokeObjectURL(imagenesPreview[index]);
    setImagenesPreview(prev => prev.filter((_, i) => i !== index));
  };

  const clearImagenes = () => {
    // Revocar todas las URLs de preview
    imagenesPreview.forEach(url => URL.revokeObjectURL(url));
    setImagenes([]);
    setImagenesPreview([]);
  };

  const addImagenes = (files: File[]) => {
    if (imagenes.length + files.length > 10) {
      alert('Máximo 10 imágenes permitidas');
      return;
    }

    const validFiles = files.filter(file => file.type.startsWith('image/'));
    setImagenes(prev => [...prev, ...validFiles]);

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagenesPreview(prev => [...prev, ...newPreviews]);
  };

  return {
    imagenes,
    imagenesPreview,
    fileInputRef,
    handleImagenesChange,
    removeImagen,
    clearImagenes,
    addImagenes
  };
}; 