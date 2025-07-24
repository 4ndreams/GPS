import React from 'react';
import { Link } from 'react-router-dom';
import '@styles/PaymentResult.css';

const PaymentPending: React.FC = () => {
  return (
    <div className="payment-result-container">
      <div className="payment-result-card pending">
        <div className="pending-icon">
          <i className="bi bi-clock-fill"></i>
        </div>
        <h2>Pago pendiente</h2>
        <p>Tu pago está siendo procesado.</p>
        
        <div className="pending-details">
          <h3>¿Qué significa esto?</h3>
          <p>Tu pago está siendo verificado por el procesador de pagos.</p>
          <p>Esto puede tardar algunos minutos o hasta 24 horas dependiendo del método de pago utilizado.</p>
        </div>
        
        <div className="next-steps">
          <h3>¿Qué pasa ahora?</h3>
          <ul>
            <li>Te notificaremos por email cuando el pago sea confirmado</li>
            <li>Puedes verificar el estado en tu perfil de usuario</li>
            <li>No realices el pago nuevamente</li>
            <li>Si tienes dudas, contáctanos</li>
          </ul>
        </div>
        
        <div className="action-buttons">
          <Link to="/" className="btn btn-primary">
            Volver al inicio
          </Link>
          <Link to="/profile" className="btn btn-secondary">
            Ver mis pedidos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;
