import React, { useEffect, useState } from 'react';
import '@styles/AboutUs.css';
import '@styles/animations.css';
// Import images
import salaVentas from '@assets/sala_ventas.jpg';
import salaVentas2 from '@assets/sala_ventas2.jpg';
import bodegaTerplac from '@assets/bodega_terplac.jpg';
import logoTerplac from '@assets/logo_terplac.svg';

const AboutUs: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [salaVentas, salaVentas2, bodegaTerplac];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="about-us fade-in">
      {/* Hero Section with Title Over Carousel */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <img src={logoTerplac} alt="TERPLAC Logo" className="hero-logo" />
            <h1 className="hero-title">Sobre Nosotros</h1>
            <p className="hero-subtitle">Innovación en puertas de alta calidad</p>
          </div>
        </div>
        
        <div className="image-carousel">
          <img 
            src={images[currentImageIndex]} 
            alt="TERPLAC Facilities" 
            className="carousel-image"
          />
          <button className="carousel-btn prev" onClick={prevImage}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className="carousel-btn next" onClick={nextImage}>
            <i className="bi bi-chevron-right"></i>
          </button>
            <div className="carousel-indicators">
            {images.map((image, index) => (
              <button 
                key={`indicator-${image.split('/').pop()}-${index}`}
                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setCurrentImageIndex(index);
                  }
                }}
                aria-label={`Ir a imagen ${index + 1}`}
                tabIndex={0}
              />
            ))}
          </div>
        </div>
      </section>      <section className="content-section">
        <div className="container">
          {/* Innovation Section */}
          <div className="innovation-section">
            <div className="section-header">
              <span className="section-badge">Innovación</span>
              <h2 className="section-title">Concepto Innovador TERPLAC</h2>
            </div>
            <div className="innovation-content">
              <div className="innovation-card">
                <div className="card-icon">
                  <i className="bi bi-lightning-charge"></i>
                </div>
                <p className="innovation-text">
                  Las puertas TERPLAC se fabrican de acuerdo a un nuevo concepto que difiere substancialmente 
                  de los sistemas tradicionales en que una puerta consiste en un marco soportante al cual se 
                  encolan las planchas que forman las caras.
                </p>
              </div>
              <div className="innovation-card">
                <div className="card-icon">
                  <i className="bi bi-arrow-repeat"></i>
                </div>
                <p className="innovation-text">
                  En la puerta TERPLAC la instalación se invierte ya que las planchas de revestimientos al ser 
                  prensadas al núcleo de Honey Comb son las que soportan la puerta.
                </p>
              </div>
              <div className="innovation-card">
                <div className="card-icon">
                  <i className="bi bi-shield-check"></i>
                </div>
                <p className="innovation-text">
                  Su estructura en forma de panal de abeja hace un trabajo similar al del alma de una viga doble 
                  consiguiendo una gran estabilidad y resistencia a la flexión y al impacto.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="specifications-section">
            <div className="section-header">
              <span className="section-badge">Técnico</span>
              <h2 className="section-title">Especificaciones Técnicas</h2>
            </div>
            <div className="specifications-grid">
              <div className="spec-card primary">
                <h3>Material Principal</h3>
                <p>Bastidores de pino seleccionado con sistema finger joint</p>
                <div className="spec-detail">Máxima calidad garantizada</div>
              </div>
              
              <div className="spec-card">
                <h3>Humedad Controlada</h3>
                <p>Secado artificial con humedad máxima del 12%</p>
                <div className="spec-detail">Previene deformaciones</div>
              </div>
              
              <div className="spec-card">
                <h3>Núcleo Honey Comb</h3>
                <p>Estructura en panal de abeja para máxima resistencia</p>
                <div className="spec-detail">Tecnología avanzada</div>
              </div>
              
              <div className="spec-card">
                <h3>Proceso de Adhesión</h3>
                <p>Prensado hidráulico a 4,5% por cm² y 120° de temperatura</p>
                <div className="spec-detail">Proceso industrial controlado</div>
              </div>
            </div>
            
            <div className="technical-description">
              <p>
                La puerta TERPLAC esta formada por bastidores de pino seleccionado. Batiente estabilizados 
                con sistema finger joint, secados artificialmente con humedad máxima del 12%. Las planchas 
                de revestimiento son de madera contraenchapada (Terciado), las cuales se pegan al núcleo 
                estructural Honey Comb con un adhesivo Ureaformaldehido con catalizador melamínico mediante 
                un prensado hidráulico de 4,5% por cm² a una temperatura de 120°.
              </p>
            </div>
          </div>

          {/* Advantages Section */}
          <div className="advantages-section">
            <div className="section-header">
              <span className="section-badge">Beneficios</span>
              <h2 className="section-title">Ventajas del Sistema TERPLAC</h2>
            </div>
            <div className="advantages-grid">
              <div className="advantage-item">
                <div className="advantage-icon">
                  <i className="bi bi-shield-shaded"></i>
                </div>
                <h3>Mayor Resistencia</h3>
                <p>El núcleo Honey Comb proporciona resistencia superior a la flexión y al impacto</p>
              </div>
              
              <div className="advantage-item">
                <div className="advantage-icon">
                  <i className="bi bi-diagram-3"></i>
                </div>
                <h3>Estabilidad Estructural</h3>
                <p>La inversión del concepto tradicional mejora la estabilidad general de la puerta</p>
              </div>
              
              <div className="advantage-item">
                <div className="advantage-icon">
                  <i className="bi bi-gem"></i>
                </div>
                <h3>Materiales de Calidad</h3>
                <p>Pino seleccionado y madera contraenchapada garantizan durabilidad</p>
              </div>
              
              <div className="advantage-item">
                <div className="advantage-icon">
                  <i className="bi bi-gear"></i>
                </div>
                <h3>Proceso Controlado</h3>
                <p>Adhesión con Ureaformaldehido y prensado hidráulico aseguran la calidad</p>
              </div>
              
              <div className="advantage-item">
                <div className="advantage-icon">
                  <i className="bi bi-droplet"></i>
                </div>
                <h3>Humedad Controlada</h3>
                <p>Secado artificial al 12% previene deformaciones</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>  );
};

export default AboutUs;
