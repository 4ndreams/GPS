import { useState, useEffect, useRef } from 'react';
import { getUserProfile } from '@services/userService';
import { crearCotizacion, estaLogueado, type CotizacionData } from '@services/cotizarService';
import { 
  obtenerMateriales, 
  obtenerRellenos, 
  obtenerMaterialPorId, 
  obtenerRellenoPorId, 
  type Material as MaterialType, 
  type Relleno as RellenoType 
} from '@services/materialesService';
import Notification from '@components/Notification';
import { formatRut } from '@utils/validations';

import '@styles/Cotizar.css';


// Constantes de validación
const VALIDATION_RULES = {
  medidas: {
    ancho: {
      puertaPaso: { min: 60, max: 90 }, // 60-90 cm para puertas de paso
      puertaCloset: { min: 40, max: 60 }, // 40-60 cm para puertas de closet
    },
    alto: { min: 200, max: 240 }, // 200-240 cm para todas las puertas
  },
  espesor: {
    puertaPaso: { value: 45, label: "45mm - Puertas de paso" },
    puertaCloset: { value: 18, label: "18mm - Puertas de closet" }
  },
  telefono: {
    length: 8,
    pattern: /^\d{8}$/
  },
  rut: {
    pattern: /^\d{1,8}-[\dkK]$/
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  nombre: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  }
};

// Interfaz para errores de validación
interface ValidationErrors {
  [key: string]: string | null;
}

function Cotizar() {
  // Guardar el título original para restaurar si es necesario
  const originalTitle = useRef(document.title);
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Estados para validaciones
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  
  // Estados para materiales y rellenos
  const [materiales, setMateriales] = useState<MaterialType[]>([]);
  const [rellenos, setRellenos] = useState<RellenoType[]>([]);
  const [materialSeleccionado, setMaterialSeleccionado] = useState<MaterialType | null>(null);
  const [rellenoSeleccionado, setRellenoSeleccionado] = useState<RellenoType | null>(null);
  const [cargandoMateriales, setCargandoMateriales] = useState(false);
  
  // Total de pasos según si está logueado o no
  const totalSteps = isLoggedIn ? 4 : 5;
  
  // Datos temporales - en el futuro se pueden cargar desde la API
  const [formData, setFormData] = useState({
    id_material: '',
    id_relleno: '',
    medida_ancho: '',
    medida_alto: '',
    medida_espesor: '',
    tipo_puerta: '', // 'puertaPaso' o 'puertaCloset'
    telefono_contacto: '',
    mensaje: '',
    // Campos para usuarios no logueados
    nombre_apellido_contacto: '',
    rut_contacto: '',
    email_contacto: ''
  });

  useEffect(() => {
    // Cambiar el título de la página al montar
    document.title = 'Solicitar Cotización | TERPLAC';
    setIsLoggedIn(estaLogueado());

    // Cargar materiales y rellenos
    const cargarDatos = async () => {
      setCargandoMateriales(true);
      try {
        const [materialesData, rellenosData] = await Promise.all([
          obtenerMateriales(),
          obtenerRellenos()
        ]);
        setMateriales(materialesData);
        setRellenos(rellenosData);
      } catch (error) {
        console.error('Error al cargar materiales y rellenos:', error);
        setErrorMessage('Error al cargar los datos del formulario');
      } finally {
        setCargandoMateriales(false);
      }
    };

    if (estaLogueado()) {
      getUserProfile()
        .then(data => {
          setUser(data);
          // Para usuarios logueados, pre-llenar solo el teléfono
          setFormData(prev => ({
            ...prev,
            telefono_contacto: data.telefono ?? ''
          }));
        })
        .catch(() => {
          console.log('No se pudo obtener el perfil del usuario');
        });
    }

    cargarDatos();

    return () => {
      // Restaurar el título original al desmontar
      document.title = originalTitle.current;
    };
  }, []);

  // Validar el paso actual cuando cambien los datos relevantes
  useEffect(() => {
    const validation = validateStep(currentStep);
    setIsCurrentStepValid(validation.isValid);
    setValidationErrors(prev => ({ ...prev, ...validation.errors }));
  }, [
    currentStep, 
    formData.medida_ancho, 
    formData.medida_alto, 
    formData.medida_espesor,
    formData.tipo_puerta,
    formData.id_material,
    formData.id_relleno,
    formData.telefono_contacto,
    formData.nombre_apellido_contacto,
    formData.rut_contacto,
    formData.email_contacto,
    isLoggedIn
  ]);

  // Funciones de validación
  const validateMedida = (value: string, fieldName: string, dimension: 'ancho' | 'alto'): string | null => {
    const numValue = parseFloat(value);
    if (!value || isNaN(numValue)) {
      return `${fieldName} es requerido`;
    }

    if (dimension === 'ancho') {
      return validateAncho(numValue, fieldName);
    } else if (dimension === 'alto') {
      return validateAlto(numValue, fieldName);
    }

    return null;
  };

  const validateAncho = (numValue: number, fieldName: string): string | null => {
    if (!formData.tipo_puerta) {
      return 'Primero debe seleccionar el tipo de puerta';
    }
    const tipoPuerta = formData.tipo_puerta as 'puertaPaso' | 'puertaCloset';
    const limits = VALIDATION_RULES.medidas.ancho[tipoPuerta];
    if (numValue < limits.min) {
      return `${fieldName} debe ser mayor a ${limits.min} cm para ${tipoPuerta === 'puertaPaso' ? 'puertas de paso' : 'puertas de closet'}`;
    }
    if (numValue > limits.max) {
      return `${fieldName} debe ser menor a ${limits.max} cm para ${tipoPuerta === 'puertaPaso' ? 'puertas de paso' : 'puertas de closet'}`;
    }
    return null;
  };

  const validateAlto = (numValue: number, fieldName: string): string | null => {
    const limits = VALIDATION_RULES.medidas.alto;
    if (numValue < limits.min) {
      return `${fieldName} debe ser mayor a ${limits.min} cm`;
    }
    if (numValue > limits.max) {
      return `${fieldName} debe ser menor a ${limits.max} cm`;
    }
    return null;
  };

  const validateTipoPuerta = (value: string): string | null => {
    if (!value || value.trim() === '') {
      return 'Debe seleccionar un tipo de puerta';
    }
    if (value !== 'puertaPaso' && value !== 'puertaCloset') {
      return 'Tipo de puerta no válido';
    }
    return null;
  };

  const validateEspesor = (value: string): string | null => {
    if (!value || value.trim() === '') {
      return 'Debe seleccionar un espesor';
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return 'El espesor debe ser un número válido';
    }
    if (numValue !== 18 && numValue !== 45) {
      return 'El espesor debe ser 18mm o 45mm';
    }
    return null;
  };

  const validateTelefono = (value: string): string | null => {
    if (!value.trim()) {
      return 'El teléfono es requerido';
    }
    if (value.length !== VALIDATION_RULES.telefono.length) {
      return `El teléfono debe tener exactamente ${VALIDATION_RULES.telefono.length} dígitos`;
    }
    if (!VALIDATION_RULES.telefono.pattern.test(value)) {
      return 'El teléfono solo puede contener números';
    }
    return null;
  };

  
  // Valida el RUT incluyendo el dígito verificador
  const validateRut = (value: string): string | null => {
    if (!value.trim()) {
      return 'El RUT es requerido';
    }
    if (!VALIDATION_RULES.rut.pattern.test(value)) {
      return 'El formato del RUT no es válido (ej: 12345678-9)';
    }
    const [rutBody, dv] = value.split('-');
    if (!rutBody || !dv) {
      return 'El formato del RUT no es válido (ej: 12345678-9)';
    }
    // Calcular dígito verificador
    let sum = 0;
    let multiplier = 2;
    for (let i = rutBody.length - 1; i >= 0; i--) {
      sum += parseInt(rutBody[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    const remainder = sum % 11;
    const calculatedDv = 11 - remainder;
    let dvExpected = '';
    if (calculatedDv === 11) dvExpected = '0';
    else if (calculatedDv === 10) dvExpected = 'K';
    else dvExpected = calculatedDv.toString();
    if (dvExpected.toUpperCase() !== dv.toUpperCase()) {
      return 'El RUT ingresado no es válido';
    }
    return null;
  };

  const validateEmail = (value: string): string | null => {
    if (!value.trim()) {
      return 'El email es requerido';
    }
    if (!VALIDATION_RULES.email.pattern.test(value)) {
      return 'El formato del email no es válido';
    }
    return null;
  };

  const validateNombre = (value: string): string | null => {
    if (!value.trim()) {
      return 'El nombre es requerido';
    }
    if (value.length < VALIDATION_RULES.nombre.minLength) {
      return `El nombre debe tener al menos ${VALIDATION_RULES.nombre.minLength} caracteres`;
    }
    if (value.length > VALIDATION_RULES.nombre.maxLength) {
      return `El nombre no puede tener más de ${VALIDATION_RULES.nombre.maxLength} caracteres`;
    }
    if (!VALIDATION_RULES.nombre.pattern.test(value)) {
      return 'El nombre solo puede contener letras y espacios';
    }
    return null;
  };

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'medida_ancho':
        return validateMedida(value, 'El ancho', 'ancho');
      case 'medida_alto':
        return validateMedida(value, 'El alto', 'alto');
      case 'tipo_puerta':
        return validateTipoPuerta(value);
      case 'medida_espesor':
        return validateEspesor(value);
      case 'telefono_contacto':
        return validateTelefono(value);
      case 'rut_contacto':
        // Usar validación local
        return validateRut(value);
      case 'email_contacto':
        return validateEmail(value);
      case 'nombre_apellido_contacto':
        return validateNombre(value);
      default:
        return null;
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue = value;

    // Formateo especial para el RUT de contacto
    if (name === 'rut_contacto' && typeof newValue === 'string') {
      newValue = formatRut(newValue);
      if (newValue.length > 10) {
        newValue = newValue.substring(0, 10);
      }
    }

    // Manejar cambio de tipo de puerta - resetear espesor
    if (name === 'tipo_puerta') {
      handleTipoPuertaChange(newValue);
      return;
    }

    // Actualizar el estado del formulario
    setFormData(prev => ({ ...prev, [name]: newValue }));

    // Validar en tiempo real solo para campos de texto
    if (type !== 'checkbox') {
      const error = validateField(name, newValue);
      setValidationErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }

    // Manejar selecciones especiales
    handleMaterialRelleno(name, newValue);
  };

  const handleTipoPuertaChange = (value: string) => {
    let espesorAutomatico = '';
    if (value === 'puertaPaso') {
      espesorAutomatico = '45';
    } else if (value === 'puertaCloset') {
      espesorAutomatico = '18';
    }
    
    setFormData(prev => ({ ...prev, tipo_puerta: value, medida_espesor: espesorAutomatico }));
    
    // Validar inmediatamente
    const tipoPuertaError = validateTipoPuerta(value);
    const espesorError = validateEspesor(espesorAutomatico);
    
    setValidationErrors(prev => ({
      ...prev,
      tipo_puerta: tipoPuertaError,
      medida_espesor: espesorError
    }));
  };

  const handleMaterialRelleno = (name: string, value: string) => {
    if (name === 'id_material') {
      if (value) {
        obtenerMaterialPorId(parseInt(value))
          .then(material => setMaterialSeleccionado(material))
          .catch(() => setMaterialSeleccionado(null));
      } else {
        setMaterialSeleccionado(null);
      }
    }
    
    if (name === 'id_relleno') {
      if (value) {
        obtenerRellenoPorId(parseInt(value))
          .then(relleno => setRellenoSeleccionado(relleno))
          .catch(() => setRellenoSeleccionado(null));
      } else {
        setRellenoSeleccionado(null);
      }
    }
  };

  const validateStep = (step: number): { isValid: boolean; errors: ValidationErrors } => {
    const errors: ValidationErrors = {};
    
    switch (step) {
      case 1:
        return validateStepTipoPuerta(errors);
      case 2:
        return validateStepMedidas(errors);
      case 3:
        return validateStepMateriales(errors);
      case 4:
        return validateStepContacto(errors);
      case 5:
        return validateStepInfoContacto(errors);
      default:
        return { isValid: true, errors };
    }
  };

  const validateStepTipoPuerta = (errors: ValidationErrors) => {
    const tipoPuertaError = validateTipoPuerta(formData.tipo_puerta);
    const espesorError = validateEspesor(formData.medida_espesor);
    
    if (tipoPuertaError) errors.tipo_puerta = tipoPuertaError;
    if (espesorError) errors.medida_espesor = espesorError;
    
    return { isValid: !tipoPuertaError && !espesorError, errors };
  };

  const validateStepMedidas = (errors: ValidationErrors) => {
    const anchoError = validateMedida(formData.medida_ancho, 'El ancho', 'ancho');
    const altoError = validateMedida(formData.medida_alto, 'El alto', 'alto');
    
    if (anchoError) errors.medida_ancho = anchoError;
    if (altoError) errors.medida_alto = altoError;
    
    return { isValid: !anchoError && !altoError, errors };
  };

  const validateStepMateriales = (errors: ValidationErrors) => {
    const isValid = !!(formData.id_material && formData.id_relleno);
    if (!formData.id_material) errors.id_material = 'Debe seleccionar un material';
    if (!formData.id_relleno) errors.id_relleno = 'Debe seleccionar un relleno';
    
    return { isValid, errors };
  };

  const validateStepContacto = (errors: ValidationErrors) => {
    const telefonoError = validateTelefono(formData.telefono_contacto);
    if (telefonoError) errors.telefono_contacto = telefonoError;
    
    return { isValid: !telefonoError, errors };
  };

  const validateStepInfoContacto = (errors: ValidationErrors) => {
    if (!isLoggedIn) {
      const nombreError = validateNombre(formData.nombre_apellido_contacto);
      // Validar rut_contacto con validations.ts
      const rutError = validateRut(formData.rut_contacto);
      const emailError = validateEmail(formData.email_contacto);
      
      if (nombreError) errors.nombre_apellido_contacto = nombreError;
      if (rutError) errors.rut_contacto = rutError;
      if (emailError) errors.email_contacto = emailError;
      
      return { isValid: !nombreError && !rutError && !emailError, errors };
    }
    
    return { isValid: true, errors };
  };

  const nextStep = () => {
    const validation = validateStep(currentStep);
    if (validation.isValid) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        // No mostrar notificación al completar pasos intermedios
      }
    } else {
      setValidationErrors(prev => ({ ...prev, ...validation.errors }));
      // Mantener notificación solo en caso de error
      showNotification('Por favor, corrija los errores antes de continuar', 'error');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1: return 'Tipo de Puerta y Espesor';
      case 2: return 'Medidas del Producto';
      case 3: return 'Material y Relleno';
      case 4: return isLoggedIn ? 'Contacto y Mensaje' : 'Teléfono y Mensaje';
      case 5: return 'Información de Contacto';
      default: return '';
    }
  };

  const getStepIcon = (step: number): string => {
    switch (step) {
      case 1: return 'bi-door-open';
      case 2: return 'bi-rulers';
      case 3: return 'bi-palette';
      case 4: return 'bi-telephone';
      case 5: return 'bi-person-badge';
      default: return 'bi-circle';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validar todos los pasos antes de enviar
    let allErrors: ValidationErrors = {};
    let hasErrors = false;
    
    for (let step = 1; step <= totalSteps; step++) {
      const validation = validateStep(step);
      if (!validation.isValid) {
        hasErrors = true;
        allErrors = { ...allErrors, ...validation.errors };
      }
    }
    
    if (hasErrors) {
      setValidationErrors(allErrors);
      showNotification('Por favor, corrija todos los errores en el formulario', 'error');
      
      // Ir al primer paso con errores
      for (let step = 1; step <= totalSteps; step++) {
        if (!validateStep(step).isValid) {
          setCurrentStep(step);
          break;
        }
      }
      return;
    }
    
    // Validar que el tipo_puerta no esté vacío
    if (!formData.tipo_puerta || formData.tipo_puerta.trim() === '') {
      showNotification('El tipo de puerta es obligatorio', 'error');
      setCurrentStep(1);
      return;
    }
    
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Preparar datos según el formato del servicio
      const cotizacionData: CotizacionData = {
        id_material: parseInt(formData.id_material),
        id_relleno: parseInt(formData.id_relleno),
        medida_ancho: parseFloat(formData.medida_ancho),
        medida_alto: parseFloat(formData.medida_alto),
        medida_largo: parseFloat(formData.medida_espesor),
        tipo_puerta: formData.tipo_puerta,
        telefono_contacto: formData.telefono_contacto,
        mensaje: formData.mensaje,
      };
      
      // Logging para debugging
      console.log('Enviando cotización con tipo_puerta:', cotizacionData.tipo_puerta);

      // Para usuarios no logueados, agregar campos adicionales
      if (!isLoggedIn) {
        cotizacionData.nombre_apellido_contacto = formData.nombre_apellido_contacto;
        cotizacionData.rut_contacto = formData.rut_contacto;
        cotizacionData.email_contacto = formData.email_contacto;
      }

      const result = await crearCotizacion(cotizacionData);
      const successMsg = `¡Cotización creada exitosamente! Número de referencia: #${result.id_producto_personalizado}`;
      setSuccessMessage(successMsg);
      showNotification(successMsg, 'success');
      
      // Reiniciar wizard y limpiar formulario
      setCurrentStep(1);
      setMaterialSeleccionado(null);
      setRellenoSeleccionado(null);
      setValidationErrors({});
      setFormData({
        id_material: '',
        id_relleno: '',
        medida_ancho: '',
        medida_alto: '',
        medida_espesor: '',
        tipo_puerta: '',
        telefono_contacto: isLoggedIn ? user?.telefono ?? '' : '',
        mensaje: '',
        nombre_apellido_contacto: '',
        rut_contacto: '',
        email_contacto: ''
      });

    } catch (error: any) {
      const errorMsg = error.message ?? 'Error al crear la cotización';
      setErrorMessage(errorMsg);
      showNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cotizar-page cotizar-bg-decor" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      <h1 className="cotizar-title" style={{ position: 'relative', zIndex: 2, textAlign: 'center', margin: '32px 0 24px 0', fontWeight: 700, fontSize: '2.2rem', color: '#EC221F', letterSpacing: '0.01em' }}>Solicitar Cotización</h1>
      {/* Círculos decorativos seguros */}
      <div className="cotizar-extra-shape1" aria-hidden="true"></div>
      <div className="cotizar-extra-shape2" aria-hidden="true"></div>
      <div className="cotizar-extra-shape3" aria-hidden="true"></div>
      <div className="cotizar-extra-shape4" aria-hidden="true"></div>
      {/* Más formas decorativas a la izquierda */}
      <div className="cotizar-extra-shape5" aria-hidden="true"></div>
      <div className="cotizar-extra-shape6" aria-hidden="true"></div>
      <div className="cotizar-extra-shape7" aria-hidden="true"></div>
      {/* Marca de agua SVG decorativa en el fondo */}
      <svg
        width="340"
        height="340"
        viewBox="0 0 340 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          right: '-60px',
          bottom: '-60px',
          zIndex: 0,
          opacity: 0.10,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <ellipse cx="170" cy="170" rx="170" ry="170" fill="#EC221F" />
        <rect x="90" y="90" width="160" height="160" rx="30" fill="#fff" fillOpacity="0.7" />
        <rect x="120" y="120" width="100" height="100" rx="20" fill="#EC221F" fillOpacity="0.15" />
      </svg>
      {/* Componente de notificación */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {/* Mensajes de éxito/error */}
      {successMessage && (
        <div className="success-message">
          <i className="bi bi-check-circle"></i>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="error-message">
          <i className="bi bi-exclamation-triangle"></i>
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="cotizar-form cotizar-form-fadein">
        {/* Indicador de pasos */}
        <div className="steps-indicator">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            return (
              <div
                key={stepNumber}
                className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                <div className="step-circle">
                  {isCompleted ? (
                    <i className="bi bi-check"></i>
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                <span className="step-label">{getStepTitle(stepNumber)}</span>
              </div>
            );
          })}
        </div>
        {/* Título del paso actual */}
        <div className="current-step-header">
          <i className={`bi ${getStepIcon(currentStep)}`}></i>
          <h2>{getStepTitle(currentStep)}</h2>
        </div>
        {/* Contenido del paso */}
        <div className="step-content">
          {/* Paso 1: Tipo de puerta y espesor */}
          {currentStep === 1 && (
            <div className="step-section">
              <p className="step-description">
                Selecciona el tipo de puerta y espesor que necesitas.
              </p>
              <div className="form-row">
                <div className="field-group">
                  <label htmlFor="tipo_puerta">Tipo de puerta *</label>
                  <select
                    id="tipo_puerta"
                    name="tipo_puerta"
                    value={formData.tipo_puerta}
                    onChange={handleChange}
                    className={validationErrors.tipo_puerta ? 'error' : ''}
                    required
                  >
                    <option value="">Selecciona un tipo</option>
                    <option value="puertaPaso">Puerta de paso</option>
                    <option value="puertaCloset">Puerta de closet</option>
                  </select>
                  {validationErrors.tipo_puerta && (
                    <span className="error-text">{validationErrors.tipo_puerta}</span>
                  )}
                  <small className="help-text">
                    Selecciona si es una puerta de paso o de closet
                  </small>
                </div>
                <div className="field-group">
                <label htmlFor="medida_espesor">Espesor *</label>
                <div id="medida_espesor" style={{ minHeight: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100%' }} aria-live="polite">
                  {formData.tipo_puerta === 'puertaPaso' && (
                    <span style={{ fontWeight: 500, width: '100%' }}>45mm - Puertas de paso</span>
                  )}
                  {formData.tipo_puerta === 'puertaCloset' && (
                    <span style={{ fontWeight: 500, width: '100%' }}>18mm - Puertas de closet</span>
                  )}
                  {!formData.tipo_puerta && (
                    <span style={{ color: '#888', width: '100%' }}>Selecciona un tipo de puerta</span>
                  )}
                </div>
                  {validationErrors.medida_espesor && (
                    <span className="error-text">{validationErrors.medida_espesor}</span>
                  )}
                  <small className="help-text">
                    El espesor se selecciona automáticamente según el tipo de puerta
                  </small>
                </div>
              </div>
            </div>
          )}
          {/* Paso 2: Medidas */}
          {currentStep === 2 && (
            <div className="step-section">
              <p className="step-description">
                Especifica las dimensiones exactas del producto que deseas cotizar.
              </p>
              <div className="form-row">
                <div className="field-group">
                  <label htmlFor="medida_ancho">Ancho (cm) *</label>
                  <input
                    id="medida_ancho"
                    type="number"
                    name="medida_ancho"
                    value={formData.medida_ancho}
                    onChange={handleChange}
                    step="0.1"
                    className={validationErrors.medida_ancho ? 'error' : ''}
                    required
                  />
                  {validationErrors.medida_ancho && (
                    <span className="error-text">{validationErrors.medida_ancho}</span>
                  )}
                  <small className="help-text">
                    {(() => {
                      if (formData.tipo_puerta === 'puertaPaso') {
                        return 'Entre 60 y 90 cm para puertas de paso';
                      } else if (formData.tipo_puerta === 'puertaCloset') {
                        return 'Entre 40 y 60 cm para puertas de closet';
                      } else {
                        return 'Primero selecciona el tipo de puerta';
                      }
                    })()}
                  </small>
                </div>
                <div className="field-group">
                  <label htmlFor="medida_alto">Alto (cm) *</label>
                  <input
                    id="medida_alto"
                    type="number"
                    name="medida_alto"
                    value={formData.medida_alto}
                    onChange={handleChange}
                    step="0.1"
                    min={VALIDATION_RULES.medidas.alto.min}
                    max={VALIDATION_RULES.medidas.alto.max}
                    className={validationErrors.medida_alto ? 'error' : ''}
                    required
                  />
                  {validationErrors.medida_alto && (
                    <span className="error-text">{validationErrors.medida_alto}</span>
                  )}
                  <small className="help-text">
                    Entre {VALIDATION_RULES.medidas.alto.min} y {VALIDATION_RULES.medidas.alto.max} cm
                  </small>
                </div>
              </div>
            </div>
          )}
          {/* Paso 3: Material y Relleno */}
          {currentStep === 3 && (
            <div className="step-section">
              <p className="step-description">
                Selecciona el material y tipo de relleno para tu producto personalizado.
              </p>
              {cargandoMateriales && (
                <div className="loading-message">
                  <span className="spinner-small"></span>
                  Cargando materiales y rellenos...
                </div>
              )}
              {!cargandoMateriales && materiales.length === 0 && rellenos.length === 0 && (
                <div className="error-message">
                  <i className="bi bi-exclamation-triangle"></i>
                  No se pudieron cargar los materiales y rellenos. Por favor, verifica que el servidor esté funcionando.
                </div>
              )}
              <div className="form-row">
                <div className="field-group">
                  <label htmlFor="id_material">Material *</label>
                  <select
                    id="id_material"
                    name="id_material"
                    value={formData.id_material}
                    onChange={handleChange}
                    required
                    disabled={cargandoMateriales}
                  >
                    <option value="">
                      {materiales.length === 0 ? 'No hay materiales disponibles' : 'Seleccione un material'}
                    </option>
                    {materiales
                      .filter(material => material?.id_material)
                      .map(material => (
                        <option key={material.id_material} value={material.id_material}>
                          {material.nombre_material}
                        </option>
                      ))}
                  </select>
                  {/* Mostrar características del material seleccionado */}
                  {materialSeleccionado?.caracteristicas && (
                    <div className="caracteristicas-info">
                      <h4>Características del Material:</h4>
                      <p>{materialSeleccionado.caracteristicas}</p>
                    </div>
                  )}
                </div>
                <div className="field-group">
                  <label htmlFor="id_relleno">Relleno *</label>
                  <select
                    id="id_relleno"
                    name="id_relleno"
                    value={formData.id_relleno}
                    onChange={handleChange}
                    required
                    disabled={cargandoMateriales}
                  >
                    <option value="">
                      {rellenos.length === 0 ? 'No hay rellenos disponibles' : 'Seleccione un relleno'}
                    </option>
                    {rellenos
                      .filter(relleno => relleno?.id_relleno)
                      .map(relleno => (
                        <option key={relleno.id_relleno} value={relleno.id_relleno}>
                          {relleno.nombre_relleno}
                        </option>
                      ))}
                  </select>
                  {/* Mostrar características del relleno seleccionado */}
                  {rellenoSeleccionado?.caracteristicas && (
                    <div className="caracteristicas-info">
                      <h4>Características del Relleno:</h4>
                      <p>{rellenoSeleccionado.caracteristicas}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Paso 3: Contacto básico y mensaje */}
          {currentStep === 4 && (
            <div className="step-section">
              <p className="step-description">
                {isLoggedIn
                  ? 'Proporciona tu teléfono de contacto y cualquier mensaje adicional.'
                  : 'Proporciona tu número de teléfono y cualquier mensaje adicional.'}
              </p>
              <div className="field-group">
                <label htmlFor="telefono_contacto">Teléfono de contacto *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ whiteSpace: 'nowrap', fontWeight: 500, color: '#555' }}>+569</span>
                  <input
                    id="telefono_contacto"
                    type="tel"
                    name="telefono_contacto"
                    value={formData.telefono_contacto}
                    onChange={handleChange}
                    placeholder="Ej: 91234567"
                    maxLength={8}
                    className={validationErrors.telefono_contacto ? 'error' : ''}
                    required
                    aria-label="Teléfono de contacto"
                  />
                </div>
                {validationErrors.telefono_contacto && (
                  <span className="error-text">{validationErrors.telefono_contacto}</span>
                )}
                <small className="help-text">
                  Exactamente {VALIDATION_RULES.telefono.length} dígitos
                </small>
              </div>
              <div className="field-group">
                <label htmlFor="mensaje">Mensaje adicional</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="Describa cualquier especificación adicional..."
                  rows={4}
                  aria-label="Mensaje adicional"
                />
              </div>
              {/* Información para usuarios logueados */}
              {isLoggedIn && (
                <div className="logged-user-info">
                  <i className="bi bi-check-circle-fill"></i>
                  <p>Como has iniciado sesión, usaremos automáticamente tu información de perfil para el contacto.</p>
                </div>
              )}
            </div>
          )}
          {/* Paso 5: Información de contacto (solo para usuarios no logueados) */}
          {currentStep === 5 && !isLoggedIn && (
            <div className="step-section">
              <p className="step-description">
                Como no has iniciado sesión, necesitamos tus datos de contacto para procesar la cotización.
              </p>
              <div className="field-group">
                <label htmlFor="nombre_apellido_contacto">Nombre completo *</label>
                <input
                  id="nombre_apellido_contacto"
                  type="text"
                  name="nombre_apellido_contacto"
                  value={formData.nombre_apellido_contacto}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez González"
                  className={validationErrors.nombre_apellido_contacto ? 'error' : ''}
                  required
                />
                {validationErrors.nombre_apellido_contacto && (
                  <span className="error-text">{validationErrors.nombre_apellido_contacto}</span>
                )}
                <small className="help-text">Solo letras y espacios, mínimo 2 caracteres</small>
              </div>
              <div className="field-group">
                <label htmlFor="rut_contacto">RUT *</label>
                <input
                  id="rut_contacto"
                  type="text"
                  name="rut_contacto"
                  value={formData.rut_contacto}
                  onChange={handleChange}
                  placeholder="Ej: 12345678-9"
                  className={validationErrors.rut_contacto ? 'error' : ''}
                  required
                />
                {validationErrors.rut_contacto && (
                  <span className="error-text">{validationErrors.rut_contacto}</span>
                )}
                <small className="help-text">Formato: 12345678-9</small>
              </div>
              <div className="field-group">
                <label htmlFor="email_contacto">Email *</label>
                <input
                  id="email_contacto"
                  type="email"
                  name="email_contacto"
                  value={formData.email_contacto}
                  onChange={handleChange}
                  placeholder="tu.email@ejemplo.com"
                  className={validationErrors.email_contacto ? 'error' : ''}
                  required
                />
                {validationErrors.email_contacto && (
                  <span className="error-text">{validationErrors.email_contacto}</span>
                )}
                <small className="help-text">Ingrese un email válido</small>
              </div>
            </div>
          )}
        </div>
        {/* Navegación entre pasos */}
        <div className="step-navigation">
          {currentStep > 1 && (
            <button
              type="button"
              className="btn-prev"
              onClick={prevStep}
            >
              <i className="bi bi-arrow-left"></i>
              <span style={{ marginLeft: 6 }}>Anterior</span>
            </button>
          )}
          {currentStep < totalSteps ? (
            <button
              type="button"
              className="btn-next"
              onClick={nextStep}
              disabled={!isCurrentStepValid}
            >
              <span>Siguiente</span>
              <i className="bi bi-arrow-right" style={{ marginLeft: 6 }}></i>
            </button>
          ) : (
            <button
              type="submit"
              className="submit-button"
              disabled={loading || !isCurrentStepValid}
            >
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span className="spinner-small"></span>
                  <span>Enviando cotización...</span>
                </span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <i className="bi bi-send"></i>
                  <span>Enviar Cotización</span>
                </span>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Cotizar;
