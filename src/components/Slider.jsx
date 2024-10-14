import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Plane, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import sliderVertex from '../shaders/SliderShader/vertex.glsl';
import fragmentSlider from '../shaders/SliderShader/fragment.glsl';
import groundVertex from '../shaders/ProjectsGround/vertex.glsl'
import groundFragment from '../shaders/ProjectsGround/fragment.glsl'

const Slider = () => {


  const projectNames = ['Cosmic Defense' , 'DreamScape' , 'Game Engine 2D' , 'Shrinking Planet Replica' , 'Self Learning R3F']
  const projectDescriptions = [
    'Made for Mindstorm Rookie Game Jam 2023',
    'Made for Brackeys Game Jam 2024.1',
    'Self Project',
    "Made Replica of Brackeys Game 'Shrinking Planet' ",
    'Self Project'
  ]

  // Texture paths
  const texturePaths = [
    'projectsImages/cosmicdefense.jfif',
    'projectsImages/Dreamscape.png',
    'projectsImages/javafxGameEngine.png',
    'projectsImages/shrinkingPlanet.png',
    'projectsImages/r3fporshe.png'
    // Add more texture paths as needed
  ];


  const crackTexture = useTexture('Cracks/crack.png');


  // Load textures
  const textures = useTexture(texturePaths);

  const planeCount = textures.length; // Number of planes based on the textures
  const planeSize = [2, 1,32,32]; // Size for each plane
  const radius = 3 // Radius of the circle
  const speed = 0.2; // Speed of the rotation

  const planesRef = useRef([]);

  const baseUniforms = {
    uTime: { value: 0 },
  };



  const groundUniforms = {
    uTime: {value: 0},
    uCrackedTexture : {value: crackTexture}
  }

  useFrame((state, delta) => {
    baseUniforms.uTime.value = state.clock.getElapsedTime();
    groundUniforms.uTime.value = state.clock.getElapsedTime();
    const time = baseUniforms.uTime.value * speed;

    planesRef.current.forEach((plane, index) => {
      const angle = (index / planeCount) * Math.PI * 2 + time; // Dynamic angle with time
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);

      // Update the plane's position and rotation to always look at the center
      plane.position.set(x, 0, z);
      plane.lookAt(new THREE.Vector3(0, 0, 0)); // Make the plane look at the center
    });
  });

  const handleSliderMovement = () => {};

  return (
    <>
      {textures.map((texture, index) => {
        // Clone the uniforms for each Plane and assign a different texture
        const uniforms = {
          uTime: baseUniforms.uTime,
          uTexture: { value: texture }, // Assign a unique texture to each plane
        };

        return (
          <Plane
            onClick={handleSliderMovement}
            key={index}
            ref={(el) => (planesRef.current[index] = el)} // Store reference to each plane
            args={planeSize} // Width and height of the plane
          >
            <shaderMaterial
              vertexShader={sliderVertex}
              fragmentShader={fragmentSlider}
              uniforms={uniforms}
              side={THREE.DoubleSide}
              
            />

          <Html distanceFactor={7} center position={[0, 1, 0]}>
          <div
            className="plane-text"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
              color: 'white',
              fontSize: '16px',
              textAlign: 'center',
              width: '200px',
              border: '4px solid cyan', // cyan border
              borderRadius: '20px', // rounded corners for a smoother look
              backdropFilter: 'blur(10px)', // blur effect for the holographic look
              background: 'transparent',
              padding: '10px', // add some padding for better spacing
            }}
        >
          <h3 style={{ margin: 0 }}>{`${projectNames[index]}`}</h3>
          <p style={{ fontSize: '12px', margin: '5px 0' }}>
            {`${projectDescriptions[index]}`}
          </p>
          <button
              style={{
                backgroundColor: 'cyan', // cyan background for the button
                color: 'white', // text color for the button
                border: '2px solid cyan', // define border with color and thickness
                borderRadius: '20px', // rounded corners for the button
                padding: '10px 15px', // padding for the button
                margin: '10px 15px',
                cursor: 'pointer', // pointer cursor on hover
                transition: 'all 0.3s ease',
                border: '2px solid cyan',
                fontWeight: 'bold',
                fontSize: '12px'


                }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = 'cyan';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'cyan';
            e.currentTarget.style.color = 'white';
          }}
        >
          Click here to redirect!
        </button>
        </div>
          </Html>
          </Plane>
        );
      })}


      <mesh position={[0,-0.7,0]} rotation={[-Math.PI / 2 , 0 ,0 ]}>
        <planeGeometry args={[10,10,32,32]}/>
        <shaderMaterial transparent uniforms={groundUniforms} vertexShader={groundVertex} fragmentShader={groundFragment}/>
      </mesh>
    </>
  );
};

export default Slider;
