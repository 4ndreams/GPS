import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const usePaymentResult = (clearCart: () => void) => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const paymentStatus = searchParams.get('collection_status');
    const paymentId = searchParams.get('payment_id');
    
    // Si el pago fue aprobado, limpiar el carrito
    if (paymentStatus === 'approved' && paymentId) {
      clearCart();
      console.log('Carrito limpiado después del pago exitoso');
    }
  }, [searchParams, clearCart]);
};
