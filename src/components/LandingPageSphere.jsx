import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import EnergySphereVertex from '../shaders/EnergySphere/vertex.glsl';
import EnergySphereFragment from '../shaders/EnergySphere/fragment.glsl';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const LandingPageSphere = () => {
  const materialRef = useRef();

  // Memoize the uniforms so that they only get created once
  const myUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uNoiseTexture: { value: null },
  }), []);

  const noise = useTexture('/noiseTextures/noise1.jpg');
  noise.wrapS = THREE.RepeatWrapping;
  noise.wrapT = THREE.RepeatWrapping;
  
  // Set the texture to uniforms once it's loaded
  if (myUniforms.uNoiseTexture.value === null) {
    myUniforms.uNoiseTexture.value = noise;
  }

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh scale={1.3} position={[0, 0.1, 0]}>
      <sphereGeometry />
      <shaderMaterial
        ref={materialRef}
        vertexShader={EnergySphereVertex}
        fragmentShader={EnergySphereFragment}
        uniforms={myUniforms}
        transparent
      />
    </mesh>
  );
};

export default LandingPageSphere;
