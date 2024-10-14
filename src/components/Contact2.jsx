import { Canvas, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import shapeVertex from '../shaders/Contact/vertex.glsl';
import shapeFragment from '../shaders/Contact/fragment.glsl';
import ringVertex from '../shaders/Contact/ringsVertex.glsl'
import ringFragment from '../shaders/Contact/ringFragment.glsl'

import { FaLinkedin } from 'react-icons/fa';
import { FaGamepad } from 'react-icons/fa'; // for itch.io
import { FaGithub } from 'react-icons/fa';
import { FaDiscord } from "react-icons/fa";
import { GiSloth } from "react-icons/gi";



const RotatingCube = ({ position, rotationSpeed }) => {
  const cubeRef = useRef();

  const size = Math.random() * 2.0 + 0.5;
  useFrame(() => {
    cubeRef.current.rotation.x += rotationSpeed[0];
    cubeRef.current.rotation.y += rotationSpeed[1];
    cubeRef.current.rotation.z += rotationSpeed[2];
  });

  return (
    <mesh ref={cubeRef} position={position}>
      <boxGeometry args={[size ,size, size]} />
      <meshStandardMaterial blending={THREE.AdditiveBlending} color="cyan" />
    </mesh>
  );
};

const ParticleSystem = () => {
  const Titlenames = ['Linkedin', 'Itch.io', 'Github', 'Discord', 'LazyAI'];



  const cubeCount = 20;
  const cubePositions = [];
  const radiusa = 15; // Radius for cube rotation
  for (let i = 0; i < cubeCount; i++) {
    const angle = (i / cubeCount) * Math.PI * 2; // Evenly spaced around the circle
    const x = Math.cos(angle) * radiusa;
    const z = Math.sin(angle) * radiusa;
    cubePositions.push([x, 4, z]); // Fixed height at 1 unit
  }

  const rotationSpeeds = cubePositions.map(() => [
    Math.random() * 0.01, 
    Math.random() * 0.01, 
    Math.random() * 0.01
  ]);



  const { camera } = useThree();
  camera.position.set(0, 25, 23);

  const particleCount = 10000;
  const particles = useRef();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const randomness = new Float32Array(particleCount * 3);

  const circleCount = 30; // Number of concentric circles
  const maxRadius = 15; // Maximum radius of the outermost circle

  let particleIndex = 0;
  
  // Loop through the number of circles
  for (let i = 0; i < circleCount; i++) {
    const radius = (i / circleCount) * maxRadius; // Radius increases with each circle
    const particlesPerCircle = Math.floor((i + 1) * 30); // More particles on outer circles
    
    // Place particles on each circle
    for (let j = 0; j < particlesPerCircle; j++) {
      if (particleIndex >= particleCount) break;
      
      const angle = (j / particlesPerCircle) * Math.PI * 2; // Evenly distribute particles

      positions[particleIndex * 3] = Math.cos(angle) * radius // X = cos(angle) * radius
      positions[particleIndex * 3 + 1] = 0; // Y is constant
      positions[particleIndex * 3 + 2] = Math.sin(angle) * radius // Z = sin(angle) * radius

      colors[particleIndex * 3] = Math.random(); // Random color R
      colors[particleIndex * 3 + 1] = Math.random(); // Random color G
      colors[particleIndex * 3 + 2] = Math.random(); // Random color B

      randomness[particleIndex * 3] = (Math.random() - 0.5) * 2.0; // Random X
      randomness[particleIndex * 3 + 1] = (Math.random() - 0.5) * 2.0; // Random Y
      randomness[particleIndex * 3 + 2] = (Math.random() - 0.5) * 2.0; // Random Z

      sizes[particleIndex] = Math.random() * 5; // Random size

      particleIndex++;
    }
  }

  useEffect(() => {
    particles.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.current.geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    particles.current.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    particles.current.geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));
  }, [positions, colors, sizes]);

  const uniforms = {
    uTime: { value: 0 },
    uIntersectionPoint: { value: new THREE.Vector3(0,0,0) },
  };


  // Positions for 5 elements in a circular arrangement
  const radius = 10;
  const buttonPositions = [];
  const buttonCount = 5;

  for (let i = 0; i < buttonCount; i++) {
    const angle = (i / buttonCount) * Math.PI * 2; // Evenly spaced angles
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    buttonPositions.push([x, 4, z]);
  }

  const handlePointerMove = (e) => {
    uniforms.uIntersectionPoint.value = e.point;
  };







  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime();


  });


  return (
    <>
      <mesh rotation={[-Math.PI / 2 , 0 , 0]}>
        <planeGeometry args={[30,30,128,128]}/>
        <shaderMaterial vertexShader={ringVertex} fragmentShader={ringFragment} uniforms={uniforms}/>
      </mesh> 
      <group rotation={[0, Math.PI / 2, 0]}>
        {buttonPositions.map((pos, index) => {
          const [x, y, z] = pos;
          return (
            <Html center key={index} position={[x, y + 3, z]} distanceFactor={15}>
              <h1 style={{ color: 'white', fontWeight: 'bold' }}>{Titlenames[index]}</h1>
            </Html>
          );
        })}

{buttonPositions.map((pos, index) => (
  <Html key={index} position={pos} distanceFactor={15} center>
    <a 
      href={index === 0 ? 'https://www.linkedin.com/in/muhammad-anas-1a9824262/' :
            index === 1 ? 'https://midnyy.itch.io/' :
            index === 2 ? 'https://github.com/muhammadanas-x' :
            index === 4 ? 'https://getlazy.ai/authors/muhammad' : '#'} 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <button className="glowing-circle-button">
        {index === 0 ? (
          <FaLinkedin size={50} />
        ) : index === 1 ? (
          <FaGamepad size={50} />
        ) : index === 2 ? (
          <FaGithub size={50} />
        ) : index === 3 ? (
          <FaDiscord size={50} />
        ) : index === 4 ? (
          <GiSloth size={50} />
        ) : (
          <span className="button-text">Button {index + 1}</span>
        )}
      </button>
    </a>
  </Html>
))}
      </group>

      <points onPointerMove={(e) => handlePointerMove(e)} ref={particles}>
        <bufferGeometry />
        <shaderMaterial
          vertexColors
          vertexShader={shapeVertex}
          fragmentShader={shapeFragment}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          uniforms={uniforms}
          
        />
      </points>


      {cubePositions.map((position, index) => (
          <RotatingCube key={index} position={position} rotationSpeed={rotationSpeeds[index]} />
        ))}

     


    </>
  );
};

const Contact2 = () => {
  return (
    <>
      <ParticleSystem />
    </>
  );
};

export default Contact2;

