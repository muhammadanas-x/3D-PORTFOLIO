import './style.css';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { OrbitControls, Stats } from '@react-three/drei'; // Import Stats
import LandingPageSphere from './components/LandingPageSphere.jsx';
import UpperPageSpheres from './components/UpperPageSpheres.jsx';
import Particles from './components/Particles.jsx';
import Slider from './components/Slider.jsx';
import Contact from './components/Contact.jsx';
import AboutMe from './components/AboutMe.jsx';
import Projects from './components/Projects.jsx';
import Projects2 from './components/Projects2.jsx';
import Contact2 from './components/Contact2.jsx';
import Shockwave from './Shockwave.jsx';
import LandingPageText from './components/LandingPageText.jsx';

const root = ReactDOM.createRoot(document.querySelector('#root'));

const App = () => {
  return (
    <Router>
      <div className='canvas-container'>
        {/* Navbar */}
        <div className="navbar">
          <Link href="/" className="navbar-title">My Portfolio</Link>
          <div className="navbar-buttons">
            <Link to="/aboutme" className="navbar-button">About Me</Link>
            <Link to="/projects" className="navbar-button">Projects</Link>
            <Link to="/contact" className="navbar-button">Contact</Link>
          </div>
        </div>

        {/* Routes to different components */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutme" element={<CanvasPage component={AboutMe} />} />
          <Route path="/projects" element={<CanvasPage component={Projects2} />} />
          <Route path="/projects2" element={<CanvasPage component={Projects2} />} />
          <Route path="/contact" element={<CanvasPage component={Contact2} />} />
        </Routes>
      </div>
    </Router>
  );
};

// Home component with the default canvas and animations
const Home = () => {
  return (
    <>
    <Canvas
      style={{ background: '#1C1C1C' }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [0, 3,5],
      }}
    >
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />
      <OrbitControls enableZoom={true} />
      <Stats />
      <LandingPageSphere />
      <Shockwave />
    </Canvas>
    <LandingPageText/>
    </>
    

  
  );
};

// Generic CanvasPage wrapper to render any component inside a Canvas and force re-render on route change
const CanvasPage = ({ component: Component }) => {
  const location = useLocation(); // React hook to get current path
  
  return (
    <Canvas
      key={location.pathname} // Key forces the Canvas to re-render on route change
      style={{ background: '#1C1C1C' }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [0, 0 , 4],
      }}
    >
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />
      <OrbitControls enableZoom />
      <Stats />
      {/* Render the passed component inside the Canvas */}
      <Component />
    </Canvas>
  );
};

root.render(<App />);
