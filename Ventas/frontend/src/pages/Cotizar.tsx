import { useState, useEffect } from 'react';
import { getUserProfile } from '../services/userService';
import '../styles/Cotizar.css';

function Cotizar() {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    ancho: '',
    alto: '',
    material: '',
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });

  useEffect(() => {
    getUserProfile()
      .then(data => {
        setUser(data);
        setFormData(prev => ({
          ...prev,
          nombre: data.nombre + " " + data.apellidos || data.name || '',
          email: data.email || '',
          telefono: data.telefono || data.phone || ''
        }));
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE}/api/cotizacion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Solicitud de cotización enviada correctamente');
        setFormData({ ancho: '', alto: '', material: '', nombre: '', email: '', telefono: '', mensaje: '' });
      } else {
        alert('Error al enviar solicitud de cotización');
      }
    } catch (error) {
      console.error('Error al enviar cotización:', error);
      alert('Error al enviar solicitud de cotización');
    }
  };

  return (
    <div className="cotizar-page">
      <h1>Solicitar Cotización</h1>
      <form onSubmit={handleSubmit} className="cotizar-form">
        <div className="field-group">
          <label>Ancho (cm)</label>
          <input 
            type="text" 
            name="ancho" 
            value={formData.ancho} 
            onChange={handleChange} 
            required />
        </div>
        <div className="field-group">
          <label>Alto (cm)</label>
          <input 
            type="text" 
            name="alto" 
            value={formData.alto} 
            onChange={handleChange} 
            required />
        </div>
        <div className="field-group">
          <label>Material</label>
          <select name="material" value={formData.material} onChange={handleChange} required>
            <option value="">Seleccione material</option>
            <option value="madera">Madera</option>
            <option value="acero">Acero</option>
            <option value="aluminio">Aluminio</option>
          </select>
        </div>
        <hr />
        <h2>Información de Contacto</h2>
        <div className="field-group">
          <label>Nombre</label>
          <input 
            type="text" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            required />
        </div>
        <div className="field-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="field-group">
          <label>Teléfono</label>
          <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required />
        </div>
        <div className="field-group">
          <label>Mensaje</label>
          <textarea name="mensaje" value={formData.mensaje} onChange={handleChange} />
        </div>
        <button type="submit" className="submit-button">Enviar Cotización</button>
      </form>
    </div>
  );
}

export default Cotizar;
