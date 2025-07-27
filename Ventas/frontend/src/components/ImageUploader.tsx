import React from 'react';
import { useProductImages } from '../hooks/useProductImages';

interface ImageUploaderProps {
  onImagesChange?: (images: File[]) => void;
  maxImages?: number;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImagesChange, 
  maxImages = 10,
  className = ""
}) => {
  const {
    imagenes,
    imagenesPreview,
    fileInputRef,
    handleImagenesChange,
    removeImagen
  } = useProductImages();

  // Notificar cambios a componente padre
  React.useEffect(() => {
    onImagesChange?.(imagenes);
  }, [imagenes, onImagesChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Input de archivos */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleImagenesChange}
        className="hidden"
      />
      
      {/* Botón para seleccionar imágenes */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <div className="text-lg">📷</div>
        <div className="text-sm text-gray-600">
          Haz clic para seleccionar imágenes (máximo {maxImages})
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {imagenes.length} de {maxImages} imágenes seleccionadas
        </div>
      </button>

      {/* Preview de imágenes */}
      {imagenesPreview.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {imagenesPreview.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImagen(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 