import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import DandelionScene from './components/DandelionScene';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Nature from './components/Nature';
import Lifecycle from './components/Lifecycle';
import Symbolism from './components/Symbolism';

function App() {
  const contentRef = useRef();
  const [natureRef, natureInView] = useInView({ threshold: 0.1 });
  const [lifecycleRef, lifecycleInView] = useInView({ threshold: 0.1 });
  const [symbolismRef, symbolismInView] = useInView({ threshold: 0.1 });

  return (
    <>
      <DandelionScene />
      <div ref={contentRef} className="relative z-10 min-h-screen p-4 md:p-8 bg-gradient-custom">
        <Navbar />
        <Hero />
        
        <div ref={natureRef} className={`content-section ${natureInView ? 'visible' : ''}`}>
          <Nature />
        </div>
        
        <div ref={lifecycleRef} className={`content-section ${lifecycleInView ? 'visible' : ''}`}>
          <Lifecycle />
        </div>
        
        <div ref={symbolismRef} className={`content-section ${symbolismInView ? 'visible' : ''}`}>
          <Symbolism />
        </div>
      </div>
    </>
  );
}

export default App;