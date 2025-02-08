import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function DandelionScene() {
  const canvasRef = useRef();
  const sceneRef = useRef();
  const isScatteringRef = useRef(false);
  const scatterIntensityRef = useRef(0);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    let camera, scene, renderer, particles, stem;
    let uniforms, geometry;
    let originalPositions = [];
    let velocities = [];
    let clock;
    let scrollTimeout;

    const vertexShader = `
      attribute float size;
      attribute vec3 customColor;
      varying vec3 vColor;
      varying float vAlpha;
      varying float vDistance;
      uniform float time;

      void main() {
        vColor = customColor;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        
        float wave = sin(position.x * 0.1 + time) * cos(position.z * 0.1 + time) * 0.15;
        wave += cos(position.y * 0.15 + time * 0.7) * 0.1;
        wave += sin((position.x + position.z) * 0.08 + time * 0.8) * 0.12;
        
        mvPosition.xyz += wave * normalize(position);
        
        float sizeMultiplier = 1.0 + sin(time * 0.5 + length(position) * 0.1) * 0.3;
        gl_PointSize = size * sizeMultiplier * (300.0 / -mvPosition.z);
        
        gl_Position = projectionMatrix * mvPosition;
        vDistance = length(position) / 15.0;
        vAlpha = size / 15.0;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      varying float vAlpha;
      varying float vDistance;
      uniform float time;

      void main() {
        vec2 xy = gl_PointCoord.xy - vec2(0.5);
        float r = length(xy);
        if (r > 0.5) discard;
        float pulseSpeed = 1.2;
        float pulseIntensity = sin(time * pulseSpeed) * 0.05 + 0.85;
        
        float glow = exp(-r * (1.8 + sin(time + vDistance * 4.0)));
        float sparkle = pow(glow, 1.2) * (sin(time * 4.0 + vDistance * 8.0) * 0.5 + 0.5);
        sparkle += pow(glow, 1.5) * (cos(time * 3.0 + vDistance * 10.0) * 0.3 + 0.3);
        
        vec3 tintColor = vec3(0.7 + sin(time * 0.2) * 0.3, 0.8, 1.0);
        vec3 finalColor = vColor * tintColor + sparkle * 0.4;
        gl_FragColor = vec4(finalColor, vAlpha * glow * pulseIntensity);
      }
    `;

    const stemVertexShader = `
      varying float vDistance;
      uniform float time;
      
      void main() {
        vDistance = position.y;
        vec3 pos = position;
        float wave = sin(time * 0.5 + position.y * 0.3) * 0.5;
        pos.x += wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const stemFragmentShader = `
      varying float vDistance;
      uniform float time;
      
      void main() {
        vec3 color = vec3(1.0, 0.95, 0.95);
        float glow = sin(time * 2.0 + vDistance * 5.0) * 0.1 + 0.9;
        gl_FragColor = vec4(color * glow, 0.7);
      }
    `;

    function createStem() {
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, -35, 0),
        new THREE.Vector3(-8, -20, 0),
        new THREE.Vector3(-3, 0, 0),
        new THREE.Vector3(0, 0, 0)
      );

      const thickness = 0.2;
      const segments = 8;
      const thickGeometry = new THREE.TubeGeometry(curve, 50, thickness, segments, false);

      const stemMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: stemVertexShader,
        fragmentShader: stemFragmentShader,
        transparent: true
      });

      stem = new THREE.Mesh(thickGeometry, stemMaterial);
      scene.add(stem);
    }

    function init() {
      clock = new THREE.Clock();
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0A0A0A);
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 70;
      camera.position.y = 10;

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      createStem();

      const particleCount = 35000;
      geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const r = 15 * Math.pow(Math.random(), 0.5);

        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        originalPositions.push(x, y, z);
        velocities.push(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        );

        colors[i * 3] = 0.98;
        colors[i * 3 + 1] = 0.96;
        colors[i * 3 + 2] = 0.93;

        sizes[i] = 1.5 + Math.random() * 2.5;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      uniforms = {
        time: { value: 0 }
      };

      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      sceneRef.current = { scene, camera, renderer, particles, geometry, uniforms, stem, originalPositions, velocities };
    }

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollYRef.current);
      
      if (scrollDelta > 5) {
        isScatteringRef.current = true;
        scatterIntensityRef.current = Math.min(scrollDelta * 0.05, 1.5);
      }
      
      lastScrollYRef.current = currentScrollY;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScatteringRef.current = false;
      }, 100);
    }

    function animate() {
      if (!sceneRef.current) return;
      
      const { scene, camera, renderer, particles, geometry, uniforms, stem, originalPositions, velocities } = sceneRef.current;
      
      requestAnimationFrame(animate);

      const time = clock.getElapsedTime();
      uniforms.time.value = time;
      stem.material.uniforms.time.value = time;

      const positions = geometry.attributes.position.array;

      if (isScatteringRef.current) {
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i] * 0.2 * scatterIntensityRef.current;
          positions[i + 1] += velocities[i + 1] * 0.2 * scatterIntensityRef.current;
          positions[i + 2] += velocities[i + 2] * 0.2 * scatterIntensityRef.current;
        }
      } else {
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += (originalPositions[i] - positions[i]) * 0.015;
          positions[i + 1] += (originalPositions[i + 1] - positions[i + 1]) * 0.015;
          positions[i + 2] += (originalPositions[i + 2] - positions[i + 2]) * 0.015;
          
          positions[i] += Math.sin(time * 0.5 + i * 0.1) * 0.01;
          positions[i + 1] += Math.cos(time * 0.3 + i * 0.05) * 0.01;
          positions[i + 2] += Math.sin(time * 0.4 + i * 0.07) * 0.01;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.0005;
      renderer.render(scene, camera);
    }

    function handleResize() {
      if (!sceneRef.current) return;
      
      const { camera, renderer } = sceneRef.current;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    init();
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (sceneRef.current) {
        // Properly dispose of Three.js resources
        const { scene, renderer, geometry, particles, stem } = sceneRef.current;
        
        // Dispose of geometries
        geometry.dispose();
        stem.geometry.dispose();
        
        // Dispose of materials
        particles.material.dispose();
        stem.material.dispose();
        
        // Remove objects from scene
        scene.remove(particles);
        scene.remove(stem);
        
        // Dispose of renderer
        renderer.dispose();
        
        // Clear the scene
        while(scene.children.length > 0) {
          scene.remove(scene.children[0]);
        }
        
        // Clear the reference
        sceneRef.current = null;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}

export default DandelionScene;