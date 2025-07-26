import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '@styles/PaymentResult.css';

const PaymentFailure: React.FC = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');

  return (
    <div className="payment-result-container">
      <div className="payment-result-card failure">
        <div className="failure-icon">
          <i className="bi bi-x-circle-fill"></i>
        </div>
        <h2>Pago no procesado</h2>
        <p>Tu pago no pudo ser procesado exitosamente.</p>
        
        <div className="failure-details">
          <h3>¿Qué pasó?</h3>
          <p>El pago fue {status === 'rejected' ? 'rechazado' : 'cancelado'} por el procesador de pagos.</p>
          <p>Esto puede deberse a:</p>
          <ul>
            <li>Fondos insuficientes</li>
            <li>Datos de tarjeta incorrectos</li>
            <li>Cancelación voluntaria</li>
            <li>Problemas técnicos temporales</li>
          </ul>
        </div>
        
        <div className="next-steps">
          <h3>¿Qué puedes hacer?</h3>
          <ul>
            <li>Verificar los datos de tu tarjeta</li>
            <li>Intentar con otro método de pago</li>
            <li>Contactarnos si el problema persiste</li>
          </ul>
        </div>
        
        <div className="action-buttons">
          <Link to="/checkout" className="btn btn-primary">
            Intentar nuevamente
          </Link>
          <Link to="/productos" className="btn btn-secondary">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
