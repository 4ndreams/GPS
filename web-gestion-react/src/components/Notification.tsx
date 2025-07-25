import React, { useEffect, useState } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  type?: NotificationType;
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

const icons = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-green-600">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-red-600">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-yellow-600">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-blue-600">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const bgColors = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  warning: 'bg-yellow-50 border-yellow-200',
  info: 'bg-blue-50 border-blue-200',
};

const Notification: React.FC<NotificationProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {

  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  // Forzar animación de entrada en el siguiente tick (mayor delay para asegurar primer render)
  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(show);
  }, []);

  // Auto-cierre después de 3s
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [visible]);

  // Cuando visible pasa a false, espera la animación y luego desmonta
  useEffect(() => {
    if (!visible) {
      const timeout = setTimeout(() => {
        setShouldRender(false);
        if (onClose) onClose();
      }, 500); // igual a duration-500
      return () => clearTimeout(timeout);
    }
    setShouldRender(true);
  }, [visible, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      role="alert"
      className={`rounded-md border p-4 shadow-sm flex items-start gap-4 ${bgColors[type]} ${className} transition-opacity duration-500 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ willChange: 'opacity' }}
    >
      {icons[type]}
      <div className="flex-1">
        <strong className="font-medium text-gray-900">{title}</strong>
        {message && <p className="mt-0.5 text-sm text-gray-700">{message}</p>}
      </div>
      {onClose && (
        <button
          className="-m-3 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          type="button"
          aria-label="Dismiss alert"
          onClick={() => setVisible(false)}
        >
          <span className="sr-only">Dismiss popup</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Notification;
