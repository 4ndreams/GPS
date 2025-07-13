import { useState, useEffect } from 'react';
import { getUserProfile } from '../services/userService';
import { crearCotizacion, estaLogueado, type CotizacionData } from '../services/cotizarService';
import { 
  obtenerMateriales, 
  obtenerRellenos, 
  obtenerMaterialPorId, 
  obtenerRellenoPorId, 
  type Material as MaterialType, 
  type Relleno as RellenoType 
} from '../services/materialesService';
import Notification from '../components/Notification';
import '../styles/Cotizar.css';

// Constantes de validación
const VALIDATION_RULES = {
  medidas: {
    ancho: { min: 10, max: 150 }, // 10-150 cm
    alto: { min: 10, max: 225 },  // 10-225 cm
    largo: { min: 10, max: 300 }, // 10-300 cm
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
  const totalSteps = isLoggedIn ? 3 : 4;
  
  // Datos temporales - en el futuro se pueden cargar desde la API
  const [formData, setFormData] = useState({
    id_material: '',
    id_relleno: '',
    medida_ancho: '',
    medida_alto: '',
    medida_largo: '',
    telefono_contacto: '',
    mensaje: '',
    // Campos para usuarios no logueados
    nombre_apellido_contacto: '',
    rut_contacto: '',
    email_contacto: ''
  });

  useEffect(() => {
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
        console.log('Materiales cargados:', materialesData);
        console.log('Rellenos cargados:', rellenosData);
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
    formData.medida_largo,
    formData.id_material,
    formData.id_relleno,
    formData.telefono_contacto,
    formData.nombre_apellido_contacto,
    formData.rut_contacto,
    formData.email_contacto,
    isLoggedIn
  ]);

  // Funciones de validación
  const validateMedida = (value: string, fieldName: string, dimension: 'ancho' | 'alto' | 'largo'): string | null => {
    const numValue = parseFloat(value);
    if (!value || isNaN(numValue)) {
      return `${fieldName} es requerido`;
    }
    
    const limits = VALIDATION_RULES.medidas[dimension];
    if (numValue < limits.min) {
      return `${fieldName} debe ser mayor a ${limits.min} cm`;
    }
    if (numValue > limits.max) {
      return `${fieldName} debe ser menor a ${limits.max} cm`;
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

  const validateRut = (value: string): string | null => {
    if (!value.trim()) {
      return 'El RUT es requerido';
    }
    if (!VALIDATION_RULES.rut.pattern.test(value)) {
      return 'El formato del RUT no es válido (ej: 12345678-9)';
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
      case 'medida_largo':
        return validateMedida(value, 'El largo', 'largo');
      case 'telefono_contacto':
        return validateTelefono(value);
      case 'rut_contacto':
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validar el campo en tiempo real
    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    // Manejar selección de material o relleno para mostrar características
    if (name === 'id_material' && value) {
      obtenerMaterialPorId(parseInt(value))
        .then(material => setMaterialSeleccionado(material))
        .catch(() => setMaterialSeleccionado(null));
    } else if (name === 'id_material' && !value) {
      setMaterialSeleccionado(null);
    }
    
    if (name === 'id_relleno' && value) {
      obtenerRellenoPorId(parseInt(value))
        .then(relleno => setRellenoSeleccionado(relleno))
        .catch(() => setRellenoSeleccionado(null));
    } else if (name === 'id_relleno' && !value) {
      setRellenoSeleccionado(null);
    }
  };

  const validateStep = (step: number): { isValid: boolean; errors: ValidationErrors } => {
    let isValid = true;
    const errors: ValidationErrors = {};

    switch (step) {
      case 1: {
        // Medidas
        const anchoError = validateMedida(formData.medida_ancho, 'El ancho', 'ancho');
        const altoError = validateMedida(formData.medida_alto, 'El alto', 'alto');
        const largoError = validateMedida(formData.medida_largo, 'El largo', 'largo');
        
        if (anchoError) errors.medida_ancho = anchoError;
        if (altoError) errors.medida_alto = altoError;
        if (largoError) errors.medida_largo = largoError;
        
        isValid = !anchoError && !altoError && !largoError;
        break;
      }
        
      case 2: {
        // Materiales y relleno
        isValid = !!(formData.id_material && formData.id_relleno);
        if (!formData.id_material) errors.id_material = 'Debe seleccionar un material';
        if (!formData.id_relleno) errors.id_relleno = 'Debe seleccionar un relleno';
        break;
      }
        
      case 3: {
        // Contacto básico
        const telefonoError = validateTelefono(formData.telefono_contacto);
        if (telefonoError) errors.telefono_contacto = telefonoError;
        isValid = !telefonoError;
        break;
      }
        
      case 4: {
        // Información adicional (solo para usuarios no logueados)
        if (!isLoggedIn) {
          const nombreError = validateNombre(formData.nombre_apellido_contacto);
          const rutError = validateRut(formData.rut_contacto);
          const emailError = validateEmail(formData.email_contacto);
          
          if (nombreError) errors.nombre_apellido_contacto = nombreError;
          if (rutError) errors.rut_contacto = rutError;
          if (emailError) errors.email_contacto = emailError;
          
          isValid = !nombreError && !rutError && !emailError;
        }
        break;
      }
        
      default:
        break;
    }

    return { isValid, errors };
  };

  const nextStep = () => {
    const validation = validateStep(currentStep);
    if (validation.isValid) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        showNotification('Paso completado correctamente', 'success');
      }
    } else {
      setValidationErrors(prev => ({ ...prev, ...validation.errors }));
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
      case 1: return 'Medidas del Producto';
      case 2: return 'Material y Relleno';
      case 3: return isLoggedIn ? 'Contacto y Mensaje' : 'Teléfono y Mensaje';
      case 4: return 'Información de Contacto';
      default: return '';
    }
  };

  const getStepIcon = (step: number): string => {
    switch (step) {
      case 1: return 'bi-rulers';
      case 2: return 'bi-palette';
      case 3: return 'bi-telephone';
      case 4: return 'bi-person-badge';
      default: return 'bi-circle';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validar todos los pasos antes de enviar
    const allStepsValid = Array.from({ length: totalSteps }, (_, i) => i + 1)
      .every(step => validateStep(step).isValid);
    
    if (!allStepsValid) {
      showNotification('Por favor, corrija todos los errores en el formulario', 'error');
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
        medida_largo: parseFloat(formData.medida_largo),
        telefono_contacto: formData.telefono_contacto,
        mensaje: formData.mensaje,
      };

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
        medida_largo: '',
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
    <div className="cotizar-page">
      <h1>Solicitar Cotización</h1>
      
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

      <form onSubmit={handleSubmit} className="cotizar-form">
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
          {/* Paso 1: Medidas */}
          {currentStep === 1 && (
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
                    min={VALIDATION_RULES.medidas.ancho.min}
                    max={VALIDATION_RULES.medidas.ancho.max}
                    className={validationErrors.medida_ancho ? 'error' : ''}
                    required 
                  />
                  {validationErrors.medida_ancho && (
                    <span className="error-text">{validationErrors.medida_ancho}</span>
                  )}
                  <small className="help-text">
                    Entre {VALIDATION_RULES.medidas.ancho.min} y {VALIDATION_RULES.medidas.ancho.max} cm
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

                <div className="field-group">
                  <label htmlFor="medida_largo">Largo (cm) *</label>
                  <input 
                    id="medida_largo"
                    type="number" 
                    name="medida_largo" 
                    value={formData.medida_largo} 
                    onChange={handleChange} 
                    step="0.1"
                    min={VALIDATION_RULES.medidas.largo.min}
                    max={VALIDATION_RULES.medidas.largo.max}
                    className={validationErrors.medida_largo ? 'error' : ''}
                    required 
                  />
                  {validationErrors.medida_largo && (
                    <span className="error-text">{validationErrors.medida_largo}</span>
                  )}
                  <small className="help-text">
                    Entre {VALIDATION_RULES.medidas.largo.min} y {VALIDATION_RULES.medidas.largo.max} cm
                  </small>
                </div>
              </div>
            </div>
          )}

          {/* Paso 2: Material y Relleno */}
          {currentStep === 2 && (
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
                      ))
                    }
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
                      ))
                    }
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
          {currentStep === 3 && (
            <div className="step-section">
              <p className="step-description">
                {isLoggedIn 
                  ? 'Proporciona tu teléfono de contacto y cualquier mensaje adicional.'
                  : 'Proporciona tu número de teléfono y cualquier mensaje adicional.'
                }
              </p>
              
              <div className="field-group">
                <label htmlFor="telefono_contacto">Teléfono de contacto *</label>
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
                />
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

          {/* Paso 4: Información de contacto (solo para usuarios no logueados) */}
          {currentStep === 4 && !isLoggedIn && (
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
              Anterior
            </button>
          )}

          {currentStep < totalSteps ? (
            <button 
              type="button" 
              className="btn-next" 
              onClick={nextStep}
              disabled={!isCurrentStepValid}
            >
              Siguiente
              <i className="bi bi-arrow-right"></i>
            </button>
          ) : (
            <button 
              type="submit" 
              className="submit-button" 
              disabled={loading || !isCurrentStepValid}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Enviando cotización...
                </>
              ) : (
                <>
                  <i className="bi bi-send"></i>
                  Enviar Cotización
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Cotizar;
