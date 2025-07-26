import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyPaymentStatus } from '@services/paymentService';
import '@styles/PaymentResult.css';

interface PaymentData {
  order?: {
    id: string;
    total: number;
    status: string;
  };
}

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentId = searchParams.get('payment_id');
        const externalReference = searchParams.get('external_reference');
        
        if (paymentId && externalReference) {
          const response = await verifyPaymentStatus(paymentId, externalReference);
          setPaymentData(response);
        }
      } catch (error) {
        console.error('Error verificando pago:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="payment-result-container">
        <div className="payment-result-card">
          <h2>Verificando pago...</h2>
          <p>Por favor espera mientras verificamos tu pago.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-result-container">
      <div className="payment-result-card success">
        <div className="success-icon">
          <i className="bi bi-check-circle-fill"></i>
        </div>
        <h2>¡Pago exitoso!</h2>
        <p>Tu pago ha sido procesado correctamente.</p>
        
        {paymentData && (
          <div className="payment-details">
            <h3>Detalles del pedido:</h3>
            <p><strong>Número de orden:</strong> #{paymentData.order?.id}</p>
            <p><strong>Total pagado:</strong> ${Number(paymentData.order?.total).toLocaleString('es-CL')}</p>
            <p><strong>Estado:</strong> {paymentData.order?.status === 'paid' ? 'Pagado' : 'Pendiente'}</p>
          </div>
        )}
        
        <div className="next-steps">
          <h3>Próximos pasos:</h3>
          <ul>
            <li>Recibirás un email de confirmación con los detalles de tu pedido</li>
            <li>Nos contactaremos contigo para coordinar el retiro en tienda</li>
            <li>Prepararemos tus productos para el retiro</li>
          </ul>
        </div>
        
        <div className="action-buttons">
          <Link to="/productos" className="btn btn-primary">
            Seguir comprando
          </Link>
          <Link to="/" className="btn btn-secondary">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
