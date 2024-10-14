import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import particlesVertex from '../shaders/Particles/vertex.glsl'
import particlesFragment from '../shaders/Particles/fragment.glsl'

const Particles = () => {
  const meshRef = useRef();
  const count = 1000; // Number of particles

  // Memoize the geometry so it's only generated once
  const particlesData = useMemo(() => {
    const positions = new Float32Array(count * 3); // 3 values per particle (x, y, z)
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;  // Random x between -50 and 50
      positions[i + 1] = (Math.random() - 0.5) * 100;  // Random y between -50 and 50
      positions[i + 2] = (Math.random() - 0.5) * 100;  // Random z between -50 and 50
    }
    return positions;
  }, [count]);

  return (
   <></>
  );
};

export default Particles;
