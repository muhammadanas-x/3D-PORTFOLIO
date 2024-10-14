import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import shockwaveNewVertex from '../src/shaders/NewShockwave/vertex.glsl'
import shockwaveNewFragment from '../src/shaders/NewShockwave/fragment.glsl'
import music from '../public/nightdetective.mp3' // import music from public folder
import * as THREE from 'three'
let myUniforms = {
  uTime: { value: 0 },
  uFrequency: { value: 0 }
};

const Shockwave = () => {
  const audioRef = useRef();
  const analyserRef = useRef();

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const audio = new Audio(music);
    audio.loop = true;
    audio.play();

    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    source.connect(audioContext.destination);

    audioRef.current = audio;

    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  useFrame(() => {
    myUniforms.uTime.value = performance.now() * 0.001; // Time in seconds

    // Get the frequency data
    const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(frequencyData);

    // Get average frequency value
    const avgFrequency = frequencyData.reduce((a, b) => a + b, 0) / frequencyData.length;
    myUniforms.uFrequency.value = avgFrequency / 256; // Normalize to 0-1 range

  });

  return (
    <>
  
      <mesh scale={2} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10 , 10, 30, 30]} />
        <shaderMaterial
          
          vertexShader={shockwaveNewVertex}
          fragmentShader={shockwaveNewFragment}
          uniforms={myUniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
};

export default Shockwave;
