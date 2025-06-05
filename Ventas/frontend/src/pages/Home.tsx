import { useEffect, useRef, useState } from 'react';
import TerplacFoto1 from '../assets/TerplacFoto1.png';
import '../styles/Home.css';

function Home() {
  const heroContentRef = useRef<HTMLDivElement>(null);

  const cardRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const [visibleCards, setVisibleCards] = useState([false, false]);

  const nosotrosRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null)
  ];
  const [visibleNosotros, setVisibleNosotros] = useState([false, false, false]);

  // Estado para los datos del formulario de contacto
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });

  // Maneja cambios en inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Maneja envío de formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('¡Mensaje enviado correctamente!');
        setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
      } else {
        alert('Ocurrió un error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('Ocurrió un error al enviar el mensaje');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const translateY = -scrollY * 1.5;
      if (heroContentRef.current) {
        heroContentRef.current.style.transform = `translateY(${translateY}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    cardRefs.forEach((ref, idx) => {
      if (!ref.current) return;
      const observer = new window.IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            setVisibleCards(prev => {
              const updated = [...prev];
              updated[idx] = entry.isIntersecting;
              return updated;
            });
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(ref.current);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [cardRefs]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    nosotrosRefs.forEach((ref, idx) => {
      if (!ref.current) return;
      const observer = new window.IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            setVisibleNosotros(prev => {
              const updated = [...prev];
              updated[idx] = entry.isIntersecting;
              return updated;
            });
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(ref.current);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [nosotrosRefs]);

  return (
    <div className="home-page">
      <section className="hero-section">
        <img src={TerplacFoto1} alt="Terplac" className="hero-image" />
        <div className="hero-overlay"></div>
        <div className="hero-content" ref={heroContentRef}>
          <h1>Puertas y molduras de alta calidad</h1>
          <p className="hero-subtitle">Soluciones elegantes y duraderas para transformar</p> 
          <p className="hero-subtitle">Cualquier espacio</p>
          <div className="hero-buttons">
            <button
              onClick={() => {
                const contacto = document.getElementById('productos-destacados');
                if (contacto) {
                  contacto.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Ver productos
            </button>
            <button
              onClick={() => {
                const contacto = document.getElementById('contacto');
                if (contacto) {
                  contacto.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Contacto
            </button>
          </div>
        </div>
      </section>
    
      <section id='productos-destacados' className='products-section'>
        <div className="hero-content-mobile">
          <h1 style={{ color: 'black' }}>Nuestros Productos</h1>
          <hr style={{ borderColor: 'black' }} />
        </div>
        <div className="card-container">
          <div
            ref={cardRefs[0]}
            className={`card card-puertas${visibleCards[0] ? ' visible' : ''}`}
          >                
            <h1>Puertas</h1>
            <p className="hero-subtitle">Elegancia y seguridad para cada entrada</p>
            <div className="hero-buttons">
              <button>Ver puertas</button>
            </div>
          </div>
          <div
            ref={cardRefs[1]}
            className={`card card-molduras${visibleCards[1] ? ' visible' : ''}`}
          >
            <h1>Marcos y Molduras</h1>
            <p className="hero-subtitle">Detalles que transforman cualquier espacio</p>
            <div className="hero-buttons">
              <button>Ver marcos y molduras</button>
            </div>
          </div>
        </div>
      </section>
      <section className='products-section'>
        <div className="hero-content-mobile">
          <h1 style={{ color: 'black' }}>Productos destacados</h1>
          <hr style={{ borderColor: 'black' }} />
        </div>
        <div className="hero-buttons">
          <button>Ver todos los productos</button>
        </div>
      </section>
      <section className='nosotros-section black-bg'>
        <div className="hero-content-mobile">
          <h1 style={{ color: 'white' }}>¿Por qué elegir Terplac?</h1>
        </div>
        
        <div className="nosotros-cards-container">
          <div
              ref={nosotrosRefs[0]}
              className={`card card-nosotros${visibleNosotros[0] ? ' visible' : ''}`}
            >
            <span className="circle-indicator">
              <i className="bi bi-globe"></i>
            </span>
            <h1>Calidad Premium</h1>
            <p className="hero-subtitle">Utilizamos los mejores materiales nacionales e internacionales para garantizar durabilidad y elegancia en cada producto.</p>
          </div>
          <div
            ref={nosotrosRefs[1]}
            className={`card card-nosotros${visibleNosotros[1] ? ' visible' : ''}`}
          >
            <span className="circle-indicator">
              <i className="bi bi-arrow-repeat"></i>
            </span>
            <h1>Garantía Extendida</h1>
            <p className="hero-subtitle">Ofrecemos garantía en todos nuestros productos para tu tranquilidad y satisfacción.</p>
          </div>
          <div
            ref={nosotrosRefs[2]}
            className={`card card-nosotros${visibleNosotros[2] ? ' visible' : ''}`}
          >
            <span className="circle-indicator">
              <i className="bi bi-shield"></i>  
            </span> 
            <h1>Certificación</h1>
            <p className="hero-subtitle">Todos nuestros modelos de puertas cumplen con certificación según norma NCH354 / NCH723.</p>
          </div>
        </div>
      </section>

      <section id='contacto' className='nosotros-section contacto-section'>
        <div className="contacto-flex">
          <div className="contacto-info">
            <div className="hero-content-mobile">
              <h1 style={{ color: 'black', textAlign: 'left' }}>Contáctanos</h1>
              <hr style={{ borderColor: 'black', marginLeft: 0 }} />
            </div>
            <div className="contacto-content">
              <p>Estamos aquí para ayudarte a encontrar la solución perfecta para tu hogar o negocio.
                 Completa el formulario y nos pondremos en contacto contigo a la brevedad.</p>
            </div>
            <div className="info-row">
                <i className="bi bi-geo-alt info-icon"></i>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Dirección</h2>
                <p style={{ margin: 0 }}>Lincoyan 880 - Concepción</p>
              </div>
            </div>
            <div className="info-row">
                <i className="bi bi-telephone info-icon"></i>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Teléfono</h2>
                <p style={{ margin: 0 }}>+56984184801 / 412223967</p>
              </div>
            </div>
            <div className="info-row">
                <i className="bi bi-envelope info-icon"></i>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Email</h2>
                <p style={{ margin: 0 }}>info@terplac.cl</p>
              </div>
            </div>
            <div className="info-row">
                <i className="bi bi-facebook info-icon"></i>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Facebook</h2>
              </div>
            </div>
            <div className="info-row">
                <i className="bi bi-instagram info-icon"></i>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Instagram</h2>
              </div>
            </div>
          </div>
          <div className='card card-contacto'>
            <form onSubmit={handleSubmit}>
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Tu correo electrónico"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                placeholder="Tu número de teléfono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
              <label>Mensaje</label>
              <textarea
                name="mensaje"
                placeholder="¿En qué podemos ayudarte?"
                value={formData.mensaje}
                onChange={handleChange}
                required
              />
              <button type="submit">Enviar Mensaje</button>
            </form>
          </div>
        </div>
      </section>

      <section className="nosotros-section black-bg footer-section">
        <div className="footer-container">
          <div className="footer-col footer-logo-desc">
          <h1>TERPLAC</h1>
          <p className="footer-desc">
            Especialistas en puertas y molduras de alta calidad para transformar cualquier espacio.
          </p>
          </div>
          <div className="footer-col">
            <h3>Productos</h3>
            <ul className="footer-list">
              <li>Puertas Interiores</li>
              <li>Puertas Exteriores</li>
              <li>Marcos</li>
              <li>Molduras</li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Enlaces</h3>
            <ul className="footer-list">
              <li>Inicio</li>
              <li>Productos</li>
              <li>Nosotros</li>
              <li>Contacto</li>
              <li>Cotizar</li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Contacto</h3>
            <ul className="footer-list">
              <li>Lincoyan 880 - Concepción</li>
              <li>+56984184801 / 412223967</li>
              <li>info@terplac.cl</li>
              <li>Facebook</li>
              <li>Instagram</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
