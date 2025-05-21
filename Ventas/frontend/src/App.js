import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          ¡Bienvenido a mundo puertas!
        </p>
        <a
          className="App-link"
          href="https://www.terplac.cl/"
          target="_blank"
          rel="noopener noreferrer"
        >Conoce la página previa de Terplac
        </a>
      </header>
    </div>
  );
}

export default App;
