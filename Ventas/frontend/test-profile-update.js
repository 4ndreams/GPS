// Script de prueba para debuggear el problema del profile update
const axios = require('axios');

// Simular datos de prueba
const testData = {
  nombre: "Juan",
  apellidos: "Pérez",
  email: "juan.perez@gmail.com",
  rut: "12345678-5"
};

// Función para probar la validación de Joi
const testJoiValidation = () => {
  console.log('=== TESTING JOI VALIDATION ===');
  console.log('Test data:', testData);
  
  // Simular la validación que hace el backend
  const Joi = require('joi');
  
  const userBodyValidation = Joi.object({
    nombre: Joi.string()
      .max(100)
      .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .messages({
        "string.pattern.base": "El nombre solo puede contener letras y espacios.",
      }),
    apellidos: Joi.string()
      .max(100)
      .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .messages({
        "string.pattern.base": "Los apellidos solo pueden contener letras y espacios.",
      }),
    email: Joi.string().email(),
    rut: Joi.string(),
  }).or("nombre", "apellidos", "email", "rut")
    .messages({
      "object.missing": "Debes enviar al menos un campo para actualizar.",
    });

  const { error } = userBodyValidation.validate(testData);
  
  if (error) {
    console.log('Validation failed:', error.message);
    console.log('Error details:', error.details);
  } else {
    console.log('Validation passed!');
  }
};

// Función para probar la petición HTTP
const testHttpRequest = async () => {
  console.log('\n=== TESTING HTTP REQUEST ===');
  
  try {
    const response = await axios.patch('http://localhost:3000/api/users/profile/edit', testData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // Reemplazar con un token válido
      }
    });
    
    console.log('Success:', response.data);
  } catch (error) {
    console.log('Error:', error.response?.data || error.message);
    console.log('Status:', error.response?.status);
  }
};

// Ejecutar pruebas
testJoiValidation();
// testHttpRequest(); // Descomentar para probar la petición HTTP

console.log('\n=== VALIDATION PATTERNS ===');
console.log('Name pattern:', /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/);
console.log('Test name "Juan":', /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test("Juan"));
console.log('Test name "Pérez":', /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test("Pérez")); 