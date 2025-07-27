import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrderPhotos } from '../hooks/useOrderPhotos';

interface OrderPhotoPreviewProps {
  id_orden: number;
  size?: 'small' | 'medium';
}

export const OrderPhotoPreview: React.FC<OrderPhotoPreviewProps> = ({ 
  id_orden, 
  size = 'small' 
}) => {
  const { photos, loading, firstPhoto } = useOrderPhotos(id_orden);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const sizeStyles = size === 'small' ? styles.smallContainer : styles.mediumContainer;
  const imageSize = size === 'small' ? styles.smallImage : styles.mediumImage;

  const openModal = () => {
    setModalVisible(true);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (photos.length <= 1) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = currentImageIndex === photos.length - 1 ? 0 : currentImageIndex + 1;
    } else {
      newIndex = currentImageIndex === 0 ? photos.length - 1 : currentImageIndex - 1;
    }
    
    setCurrentImageIndex(newIndex);
  };

  if (loading) {
    return (
      <View style={[styles.container, sizeStyles]}>
        <Ionicons name="image-outline" size={size === 'small' ? 16 : 24} color="#9CA3AF" />
      </View>
    );
  }

  if (!firstPhoto) {
    return (
      <View style={[styles.container, sizeStyles, styles.noPhoto]}>
        <Ionicons name="image-outline" size={size === 'small' ? 16 : 24} color="#9CA3AF" />
        {size === 'medium' && (
          <Text style={styles.noPhotoText}>Sin imagen</Text>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, sizeStyles]}>
      <TouchableOpacity onPress={openModal} style={styles.touchableContainer}>
        <Image
          source={{ uri: firstPhoto.ruta_imagen }}
          style={[styles.image, imageSize]}
          resizeMode="cover"
          onError={(error) => {
            console.error('❌ Error cargando imagen:', error);
            console.error('📸 URL de imagen que falló:', firstPhoto.ruta_imagen);
          }}
          onLoad={() => {
            console.log('✅ Imagen cargada exitosamente:', firstPhoto.ruta_imagen);
          }}
          onLoadStart={() => {
            console.log('🔄 Iniciando carga de imagen:', firstPhoto.ruta_imagen);
          }}
        />
      </TouchableOpacity>
      {photos.length > 1 && (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>+{photos.length - 1}</Text>
        </View>
      )}

      {/* Modal para ver imágenes en grande */}
      <Modal
        visible={modalVisible}
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            onPress={closeModal}
            activeOpacity={1}
          />
          
          <View style={styles.modalContent}>
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Imagen {currentImageIndex + 1} de {photos.length}
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {/* Imagen */}
            <View style={styles.imageContainer}>
              {photos[currentImageIndex] && (
                <Image
                  source={{ uri: photos[currentImageIndex].ruta_imagen }}
                  style={styles.fullScreenImage}
                  resizeMode="contain"
                />
              )}
            </View>
            
            {/* Controles de navegación */}
            {photos.length > 1 && (
              <View style={styles.navigationControls}>
                <TouchableOpacity 
                  style={styles.navButton}
                  onPress={() => navigateImage('prev')}
                >
                  <Ionicons name="chevron-back" size={32} color="#FFFFFF" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.navButton}
                  onPress={() => navigateImage('next')}
                >
                  <Ionicons name="chevron-forward" size={32} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  smallContainer: {
    width: 40,
    height: 40,
  },
  mediumContainer: {
    width: 60,
    height: 60,
  },
  image: {
    borderRadius: 8,
  },
  smallImage: {
    width: 40,
    height: 40,
  },
  mediumImage: {
    width: 60,
    height: 60,
  },
  noPhoto: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  noPhotoText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
    textAlign: 'center',
  },
  countBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  touchableContainer: {
    width: '100%',
    height: '100%',
  },
  // Estilos para el modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8,
  },
  navigationControls: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  navButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 12,
  },
});
