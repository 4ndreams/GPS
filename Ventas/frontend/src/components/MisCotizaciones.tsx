import React, { useState, useEffect } from 'react';
import { obtenerMisCotizaciones, type CotizacionResponse } from '@services/cotizarService';
import '@styles/MisCotizaciones.css';

const MisCotizaciones: React.FC = () => {
  const [cotizaciones, setCotizaciones] = useState<CotizacionResponse[]>([]);
  const [cotizacionesFiltradas, setCotizacionesFiltradas] = useState<CotizacionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [busquedaNumero, setBusquedaNumero] = useState<string>('');

  useEffect(() => {
    cargarCotizaciones();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [cotizaciones, filtroEstado, busquedaNumero]);

  const cargarCotizaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerMisCotizaciones();
      setCotizaciones(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...cotizaciones];

    // Filtrar por estado
    if (filtroEstado !== 'todos') {
      resultado = resultado.filter(cotizacion => cotizacion.estado === filtroEstado);
    }

    // Filtrar por número
    if (busquedaNumero.trim()) {
      resultado = resultado.filter(cotizacion => 
        cotizacion.id_producto_personalizado.toString().includes(busquedaNumero.trim())
      );
    }

    setCotizacionesFiltradas(resultado);
  };

  const limpiarFiltros = () => {
    setFiltroEstado('todos');
    setBusquedaNumero('');
  };

  const getEstadosDisponibles = () => {
    const estados = [...new Set(cotizaciones.map(c => c.estado))];
    return estados.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
  };

  const getEstadoColor = (estado: string): string => {
    switch (estado) {
      case 'Solicitud Recibida':
        return '#6b7280'; // Gris (outline style)
      case 'En Proceso':
        return '#9ca3af'; // Gris claro (secondary style)
      case 'Lista para retirar':
        return '#374151'; // Gris oscuro (default style)
      case 'Cancelada':
        return '#dc2626'; // Rojo (destructive style)
      case 'Producto Entregado':
        return '#16a34a'; // Verde (success style)
      default:
        return '#6b7280'; // Gris (outline style)
    }
  };

  const getEstadoIcon = (estado: string): string => {
    switch (estado) {
      case 'Solicitud Recibida':
        return 'bi-clock';
      case 'En Proceso':
        return 'bi-gear-fill';
      case 'Lista para retirar':
        return 'bi-box-seam';
      case 'Cancelada':
        return 'bi-x-circle-fill';
      case 'Producto Entregado':
        return 'bi-box-seam';
      default:
        return 'bi-clock';
    }
  };

  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearMedidas = (ancho: number, alto: number, largo: number): string => {
    return `${ancho} cm × ${alto} cm × ${largo} mm`;
  };

  const formatearTipoPuerta = (tipo: string): string => {
    switch (tipo) {
      case 'puertaPaso':
        return 'Puerta de paso';
      case 'puertaCloset':
        return 'Puerta de closet';
      default:
        return 'Tipo no especificado';
    }
  };

  const formatearPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(precio);
  };

  const mostrarPrecio = (cotizacion: CotizacionResponse): boolean => {
    return cotizacion.estado !== 'Solicitud Recibida' && cotizacion.precio !== undefined && cotizacion.precio > 0;
  };

  if (loading) {
    return (
      <div className="cotizaciones-container">
        <div className="cotizaciones-header">
          <h2>
            <i className="bi bi-clipboard-data"></i>{' '}
              Mis Cotizaciones
          </h2>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando tus cotizaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cotizaciones-container">
        <div className="cotizaciones-header">
          <h2>
            <i className="bi bi-clipboard-data"></i>{' '}
            Mis Cotizaciones
          </h2>
        </div>
        <div className="error-container">
          <i className="bi bi-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={cargarCotizaciones} className="retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (cotizaciones.length === 0) {
    return (
      <div className="cotizaciones-container">
        <div className="cotizaciones-header">
          <h2>
            <i className="bi bi-clipboard-data"></i>{' '}
            Mis Cotizaciones
          </h2>
        </div>
        <div className="empty-state">
          <i className="bi bi-inbox"></i>
          <h3>No tienes cotizaciones aún</h3>
          <p>Cuando solicites una cotización aparecerá aquí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cotizaciones-container">
      <div className="cotizaciones-header">
        <h2>
          <i className="bi bi-clipboard-data"></i>{' '}
            Mis Cotizaciones
        </h2>
        <span className="cotizaciones-count">
          {cotizacionesFiltradas.length} de {cotizaciones.length} cotización{cotizaciones.length !== 1 ? 'es' : ''}
        </span>
      </div>

      {/* Filtros */}
      <div className="filtros-container">
        <div className="filtros-row">
          <div className="filtro-grupo">
            <label htmlFor="filtro-estado">
              <i className="bi bi-funnel"></i>{' '}
              Estado:
            </label>
            <select
              id="filtro-estado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="filtro-select"
            >
              <option value="todos">Todos los estados</option>
              {getEstadosDisponibles().map(estado => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

          <div className="filtro-grupo">
            <label htmlFor="busqueda-numero">
              <i className="bi bi-search"></i>{' '}
              Buscar por número:
            </label>
            <input
              id="busqueda-numero"
              type="text"
              value={busquedaNumero}
              onChange={(e) => setBusquedaNumero(e.target.value)}
              placeholder="Ej: 123"
              className="filtro-input"
            />
          </div>

          {(filtroEstado !== 'todos' || busquedaNumero.trim()) && (
            <button onClick={limpiarFiltros} className="btn-limpiar-filtros">
              <i className="bi bi-x-circle"></i>{' '}
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Mensaje de no resultados - Fuera del contenedor de filtros */}
      {cotizacionesFiltradas.length === 0 && (filtroEstado !== 'todos' || busquedaNumero.trim()) && (
        <div className="no-resultados">
          <i className="bi bi-search"></i>
          <p>No se encontraron cotizaciones con los filtros aplicados</p>
        </div>
      )}

      <div className="cotizaciones-grid">
        {cotizacionesFiltradas.map((cotizacion) => (
          <div key={cotizacion.id_producto_personalizado} className="cotizacion-card">
            {/* Header de la tarjeta con estado */}
            <div 
              className="cotizacion-header"
              style={{ backgroundColor: getEstadoColor(cotizacion.estado) }}
            >
              <div className="estado-info">
                <i className={`bi ${getEstadoIcon(cotizacion.estado)}`}></i>
                <span className="estado-text">{cotizacion.estado}</span>
              </div>
              <div className="header-right">
                {mostrarPrecio(cotizacion) && (
                  <div className="precio-badge">
                    <i className="bi bi-currency-dollar"></i>
                    <span className="precio-text">{formatearPrecio(cotizacion.precio!)}</span>
                  </div>
                )}
                <span className="cotizacion-id">#{cotizacion.id_producto_personalizado}</span>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="cotizacion-content">
              <div className="cotizacion-details">
                <h3 className="cotizacion-title">
                  <i className="bi bi-door-open-fill"></i>
                  {formatearTipoPuerta(cotizacion.tipo_puerta)}
                </h3>
                </div>
              <div className="cotizacion-info">
                <div className="info-section">
                  <h4>
                    <i className="bi bi-rulers"></i>{' '}
                    Medidas
                  </h4>
                  <p className="medidas">
                    {formatearMedidas(
                      cotizacion.medida_ancho,
                      cotizacion.medida_alto,
                      cotizacion.medida_largo
                    )}
                  </p>
                </div>

                <div className="info-section">
                  <h4>
                    <i className="bi bi-palette"></i>{' '}
                    Material y Relleno
                  </h4>
                  <p>
                    <strong>Material:</strong> {cotizacion.material.nombre_material}
                  </p>
                  <p>
                    <strong>Relleno:</strong> {cotizacion.relleno.nombre_relleno}
                  </p>
                </div>

                <div className="info-section">
                  <h4>
                    <i className="bi bi-chat-text"></i>{' '}
                    Mensaje
                  </h4>
                  <p className="mensaje">{cotizacion.mensaje}</p>
                </div>

                <div className="info-section">
                  <h4>
                    <i className="bi bi-telephone"></i>{' '}
                    Contacto
                  </h4>
                  <p>
                    <strong>Teléfono:</strong> {cotizacion.telefono_contacto}
                  </p>
                  <p>
                    <strong>Email:</strong> {cotizacion.email_contacto}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer con fechas */}
            <div className="cotizacion-footer">
              <div className="fecha-info">
                <span className="fecha-label">Creado:</span>
                <span className="fecha-valor">{formatearFecha(cotizacion.createdAt)}</span>
              </div>
              {cotizacion.updatedAt !== cotizacion.createdAt && (
                <div className="fecha-info">
                  <span className="fecha-label">Actualizado:</span>
                  <span className="fecha-valor">{formatearFecha(cotizacion.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MisCotizaciones;
