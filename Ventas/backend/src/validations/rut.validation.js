// validations/rutValidator.js

const RutValidator = {
  /**
   * Valida un RUT chileno con formato "12345678-5" o "123456785"
   * @param {string} input
   * @returns {boolean}
   */
  isValidRut: function (input) {
    if (!input) return false;

    // Limpia puntos y guiones
    const cleanInput = input.replace(/\./g, "").replace(/-/g, "").toUpperCase();

    // Requiere al menos 2 caracteres
    if (cleanInput.length < 2) return false;

    const rut = cleanInput.slice(0, -1);
    let dv = cleanInput.slice(-1);

    if (!/^\d+$/.test(rut)) return false;
    if (!/^[0-9K]$/i.test(dv)) return false;

    if (dv === "K") dv = "k";

    return dv === RutValidator.calculateDv(parseInt(rut, 10));
  },

  /**
   * Calcula el dígito verificador de un RUT
   * @param {number} rut
   * @returns {string}
   */
  calculateDv: function (rut) {
    let M = 0, S = 1;
    for (; rut; rut = Math.floor(rut / 10)) {
      S = (S + (rut % 10) * (9 - (M++ % 6))) % 11;
    }
    return S ? (S - 1).toString() : "k";
  },

  /**
   * Formatea un RUT limpio a formato con puntos y guión
   * @param {string} input RUT limpio como "123456785"
   * @returns {string}
   */
  formatRut: function (input) {
    const clean = input.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    if (!/^\d{7,8}[0-9K]$/.test(clean)) return input;

    return clean.replace(/^(\d{1,2})(\d{3})(\d{3})([0-9K])$/, "$1.$2.$3-$4");
  },

  /**
   * Valida y formatea un RUT, avisando si falta el dígito verificador.
   * @param {string} input RUT con o sin puntos y guión (ej. "12345678-5" o "123456785").
   * @returns {{ valid: boolean, message?: string, formatted?: string }}
   */
  validateRut: function (input) {
    if (!input) {
      return { valid: false, message: 'RUT vacío' };
    }
    // Normalizar entrada
    const clean = input.replace(/\./g, '').toUpperCase();
    // Verificar presencia de dígito verificador
    if (!clean.includes('-')) {
      return { valid: false, message: 'Falta dígito verificador' };
    }
    // Validar formato y dígito
    if (!RutValidator.isValidRut(clean)) {
      return { valid: false, message: 'Dígito verificador inválido' };
    }
    // Devolver formateado
    const formatted = RutValidator.formatRut(clean);
    return { valid: true, formatted };
  }
};

export default RutValidator;
