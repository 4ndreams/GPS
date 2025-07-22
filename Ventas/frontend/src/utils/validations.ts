// Función para formatear RUT sin puntos, con guión
export function formatRut(rut: string): string {
  // Eliminar caracteres que no sean números y la letra K
  rut = rut.replace(/[^\dkK]/g, "").toUpperCase();
  
  // Si está vacío o muy corto, retornar tal como está
  if (rut.length < 2) return rut;
  
  // Si es muy largo, tomar solo los primeros 9 caracteres (8 dígitos + 1 dígito verificador)
  if (rut.length > 9) {
    rut = rut.substring(0, 9);
  }
  
  // Separar cuerpo y dígito verificador
  const body = rut.slice(0, -1);
  const dv = rut.slice(-1);
  
  // Verificar que el cuerpo solo contenga números
  if (!/^\d+$/.test(body)) {
    // Si el cuerpo tiene caracteres no numéricos, filtrarlos
    const cleanBody = body.replace(/\D/g, "");
    if (cleanBody.length === 0) return "";
    return cleanBody.length >= 1 ? cleanBody + "-" + dv : cleanBody;
  }
  
  // Formatear solo con guión (sin puntos)
  return body + "-" + dv;
}

// Función para calcular el dígito verificador del RUT
function calculateRutDv(rutBody: string): string {
  let sum = 0;
  let multiplier = 2;
  
  // Recorrer el RUT de derecha a izquierda
  for (let i = rutBody.length - 1; i >= 0; i--) {
    sum += parseInt(rutBody[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = sum % 11;
  const dv = 11 - remainder;
  
  if (dv === 11) return '0';
  if (dv === 10) return 'K';
  return dv.toString();
}

// Validación de RUT
export function validateRut(rut: string): string | null {
  if (!rut.trim()) {
    return 'El RUT es requerido';
  }
  
  // Patrón para RUT sin puntos con guión: 7 u 8 dígitos + guión + dígito verificador
  const rutPattern = /^\d{7,8}-[\dkK]$/;
  if (!rutPattern.test(rut)) {
    return 'El formato del RUT no es válido (ej: 12345678-9)';
  }
  
  // Separar cuerpo y dígito verificador
  const [rutBody, dv] = rut.split('-');
  
  // Calcular el dígito verificador correcto
  const calculatedDv = calculateRutDv(rutBody);
  
  // Comparar con el dígito verificador proporcionado
  if (calculatedDv.toUpperCase() !== dv.toUpperCase()) {
    return 'El RUT ingresado no es válido';
  }
  
  return null;
}

// Validación de email
export function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return 'El email es requerido';
  }
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return 'El formato del email no es válido';
  }
  
  return null;
}

// Validación de nombres
export function validateNombre(nombre: string): string | null {
  if (!nombre.trim()) {
    return 'Este campo es requerido';
  }
  
  if (nombre.length < 2) {
    return 'Debe tener al menos 2 caracteres';
  }
  
  if (nombre.length > 100) {
    return 'No puede tener más de 100 caracteres';
  }
  
  // Solo letras, espacios y caracteres especiales del español
  const nombrePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nombrePattern.test(nombre)) {
    return 'Solo se permiten letras y espacios';
  }
  
  return null;
}

// Validación de teléfono
export function validateTelefono(telefono: string): string | null {
  if (!telefono.trim()) {
    return 'El teléfono es requerido';
  }
  
  // Permitir formato chileno: +56 9 1234 5678 o 9 1234 5678 o 912345678
  const telefonoPattern = /^(\+56\s?)?([2-9]\d{8}|9\d{8})$/;
  if (!telefonoPattern.test(telefono.replace(/\s/g, ''))) {
    return 'El formato del teléfono no es válido';
  }
  
  return null;
}

// Validación de contraseña
export function validatePassword(password: string): string | null {
  if (!password.trim()) {
    return 'La contraseña es requerida';
  }
  
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  
  return null;
}

// Función para validar un campo específico
export function validateField(name: string, value: string): string | null {
  switch (name) {
    case 'nombres':
    case 'apellidos':
      return validateNombre(value);
    case 'rut':
      return validateRut(value);
    case 'email':
      return validateEmail(value);
    case 'telefono':
      return validateTelefono(value);
    case 'password':
      return validatePassword(value);
    default:
      return null;
  }
}
