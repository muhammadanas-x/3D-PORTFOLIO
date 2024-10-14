import React, { useEffect, useRef, useState } from 'react';
import { Html, ScrollControls, useGLTF, useScroll } from '@react-three/drei';
import { gsap } from 'gsap';
import groundVertex from '../shaders/Projects/vertex.glsl';
import groundFragment from '../shaders/Projects/fragment.glsl';


import interactivePlaneVertex from '../shaders/Particles/interactivePlaneVertex.glsl'
import interactivePlaneFragment from '../shaders/Particles/interactivePlaneFragment.glsl'
import particlesVertex from '../shaders/Particles/vertex.glsl'
import particlesFragment from '../shaders/Particles/fragment.glsl';


import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

const Projects = () => {
  const gltf = useGLTF('./Models/tron.glb');
  const isWPressed = useRef(false); // Use useRef for key press
  const isSPressed = useRef(false);


  const positions = [
    [1.6, 1, -5],
    [-1.6, 1, -7.5],
    [1.6, 1, -10],
    [-1.6, 1, -12.5],
    [1.6, 1, -15],
  ];

  const titles = [
    "DreamScape",
    "Shrinking Planet",
    "React Three Fiber Porshe Template",
    "JavaFX Game Engine 2D",
    "Cosmic Defense",
  ]


  const descriptions = [
    "This Game Was made for Brackeys Game Jam 2024.1",
    "This Game Was made as an inspiration from Brackeys Channel",
    "This is just a practice project made for my own experience to play around with React Three Fiber",
    "This is my Second Semester Project which inherits python code with java code at runtime and display Graphics , JavaFX Game Engine 2D",
    "This Project was made for a local Game Jam Rookie Game Jam 2023 initiated by Mindstorm Labs Lahore",
  ]

  const gridUniforms = {
    uTime: {value : 0},
    uProgressToComplete: {value: 0.3}
  }

  const {camera , renderer} = useThree()
  // Create refs dynamically for each mesh and particles
  const planeRefs = useRef([]);
  const groupRef = useRef();
  const particlesRefs = useRef([]);


        const displacement = {}

        // 2D canvas
        displacement.canvas = document.createElement('canvas')
        displacement.canvas.width = 128
        displacement.canvas.height = 128
        displacement.canvas.style.position = 'fixed'
        displacement.canvas.style.width = '256px'
        displacement.canvas.style.height = '256px'
        displacement.canvas.style.top = 0
        displacement.canvas.style.left = 0
        displacement.canvas.style.zIndex = 10
        document.body.append(displacement.canvas)

         // Coordinates
         displacement.screenCursor = new THREE.Vector2(9999, 9999)
         displacement.canvasCursor = new THREE.Vector2(9999, 9999)
         displacement.canvasCursorPrevious = new THREE.Vector2(9999, 9999)
 
        // Context
        displacement.context = displacement.canvas.getContext('2d')
        displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)

        // Glow image
        displacement.glowImage = new Image()
        displacement.glowImage.src = './glow.png'
  // Create a ref for the shader material
  const shaderRef = useRef();

  useEffect(() => {
    gsap.to(gridUniforms.uProgressToComplete, {
      value: 1,
      duration: 3,
      ease: 'power1.inOut',
    });

    const handleKeyDown = (event) => {
      if (event.key === 'w' || event.key === 'W') {
        isWPressed.current = true; // Use ref
      }
      else if(event.key === 's' || event.key === "S")
      {
        isSPressed.current = true;
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === 'w' || event.key === 'W') {
        isWPressed.current = false; // Use ref
      }
      else if(event.key === 's' || event.key === "S")
        {
          isSPressed.current = false;
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);


  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

        

      const textureLoader = new THREE.TextureLoader();
      const texturePaths = [
        './projectsImages/Dreamscape.png',
        './projectsImages/shrinkingPlanet.png', // Add more texture paths here
        './projectsImages/r3fporshe.png',
        './projectsImages/javafxGameEngine.png',
        './projectsImages/cosmicdefensejfif.png',
      ];

      const textures = texturePaths.map(path => textureLoader.load(path));




    displacement.texture = new THREE.CanvasTexture(displacement.canvas)


        const particlesGeometry = new THREE.PlaneGeometry(2, 1, 128, 128)
        particlesGeometry.setIndex(null)
        particlesGeometry.deleteAttribute('normal')
        
        const intensitiesArray = new Float32Array(particlesGeometry.attributes.position.count)
        const anglesArray = new Float32Array(particlesGeometry.attributes.position.count)
        
        for(let i = 0; i < particlesGeometry.attributes.position.count; i++)
        {
            intensitiesArray[i] = Math.random()
            anglesArray[i] = Math.random() * Math.PI * 2
        }
        
        particlesGeometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensitiesArray, 1))
        particlesGeometry.setAttribute('aAngle', new THREE.BufferAttribute(anglesArray, 1))
        
        const particlesMaterials = positions.map((position, index) => {
          return new THREE.ShaderMaterial({
            vertexShader: particlesVertex,
            fragmentShader: particlesFragment,
            uniforms: {
              uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
              uPictureTexture: new THREE.Uniform(textures[index % textures.length]), // Cycle through textures
              uDisplacementTexture: new THREE.Uniform(displacement.texture),
              uTime: { value: 0 },
            },
            blending: THREE.AdditiveBlending,
          });
        });




    window.addEventListener('pointermove', (event) =>
        {
            displacement.screenCursor.x = (event.clientX / sizes.width) * 2 - 1
            displacement.screenCursor.y = - (event.clientY / sizes.height) * 2 + 1
        })



    window.addEventListener('resize', () =>
        {
            // Update sizesa
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight
            sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)
    
            // Materials
            particlesMaterial.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)
    
            // Update camera
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()
    
            // Update renderer
            renderer.setSize(sizes.width, sizes.height)
            renderer.setPixelRatio(sizes.pixelRatio)
        })


        displacement.raycaster = new THREE.Raycaster()

       
      
        useFrame((state) => {
          const elapsedTime = state.clock.getElapsedTime();
      
          if (shaderRef.current) {
            gridUniforms.uTime.value = elapsedTime;
          }
      
          particlesRefs.current.forEach((particlesRef) => {
            if (particlesRef) {
              particlesRef.material.uniforms.uTime.value = elapsedTime;
            }
          });
        
          // Handle raycaster for displacement texture updates
          displacement.raycaster.setFromCamera(displacement.screenCursor, camera);


        planeRefs.current.forEach((planeRef) => {
          if (planeRef) {
            const intersections = displacement.raycaster.intersectObject(planeRef);
            
            if (intersections.length) {
              const uv = intersections[0].uv;
              displacement.canvasCursor.x = uv.x * displacement.canvas.width;
              displacement.canvasCursor.y = (1 - uv.y) * displacement.canvas.height;
            }
          }
        });

      
          // Fade and glow logic for displacement
          displacement.context.globalCompositeOperation = 'source-over';
          displacement.context.globalAlpha = 0.02;
          displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height);
      
          const cursorDistance = displacement.canvasCursorPrevious.distanceTo(displacement.canvasCursor);
          displacement.canvasCursorPrevious.copy(displacement.canvasCursor);
          const alpha = Math.min(cursorDistance * 0.05, 1);
      
          const glowSize = displacement.canvas.width * 0.25;
          displacement.context.globalCompositeOperation = 'lighten';
          displacement.context.globalAlpha = alpha;
          displacement.context.drawImage(
            displacement.glowImage,
            displacement.canvasCursor.x - glowSize * 0.5,
            displacement.canvasCursor.y - glowSize * 0.5,
            glowSize,
            glowSize
          );
      
          displacement.texture.needsUpdate = true;
      
          // Handle isWPressed state without disrupting the rendering process
          if (isWPressed.current) {

            groupRef.current.position.z += 0.1;

          }
          else if(isSPressed.current)
          {
            groupRef.current.position.z -= 0.1;

          }
        });
  return (
    <>
       <mesh scale={3} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 15, 128, 128]} />
        <shaderMaterial
          ref={shaderRef}
          vertexShader={groundVertex}
          fragmentShader={groundFragment}
          uniforms={gridUniforms}
          transparent
        />
      </mesh> 


      <mesh scale={3} position={[0,5,0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 15, 128, 128]} />
        <shaderMaterial
          ref={shaderRef}
          vertexShader={groundVertex}
          fragmentShader={groundFragment}
          uniforms={gridUniforms}
          
          side={THREE.DoubleSide}
        />
      </mesh> 



      <group ref={groupRef}>
      {positions.map((position, index) => (
        <group
          key={index}
          rotation={[0, index % 2 == 0 ? -Math.PI / 4 : Math.PI / 4, 0]}
          position={position}
        >
          <mesh ref={(ref) => (planeRefs.current[index] = ref)}>
            <planeGeometry args={[2, 1, 128, 128]} />
            <shaderMaterial
              uniforms={{ uTime: { value: 0 } }}
              vertexShader={interactivePlaneVertex}
              fragmentShader={interactivePlaneFragment}
              side={THREE.DoubleSide}
            />
          </mesh>
          <points
            ref={(ref) => (particlesRefs.current[index] = ref)}
            geometry={particlesGeometry}
            material={particlesMaterials[index]}
          />


        <Html distanceFactor={2} position={[0, 1, 0]} center>
              <div className="neon-container">
                <h1 className="neon-title">{titles[index]}</h1>
                <p className="neon-description">={descriptions[index]}</p>

              </div>
        </Html>

        <Html distanceFactor={2} position={[-0.4,-0.5,0]}>
          <button href="#" className="neon-button">Explore Project</button>

        </Html>
        </group>
      ))}
    </group>
       

       
    
      <primitive scale={3} object={gltf.scene} /> 


    </>
  );
};

export default Projects;
