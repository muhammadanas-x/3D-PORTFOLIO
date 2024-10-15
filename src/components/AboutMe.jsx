import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import aboutVertex from '../shaders/About/vertex.glsl';
import aboutFragment from '../shaders/About/fragment.glsl';
import { useFrame } from '@react-three/fiber';
import { Html, useGLTF, useTexture } from '@react-three/drei';
import groundVertex from '../shaders/Projects/vertex.glsl';
import groundFragment from '../shaders/Projects/fragment.glsl';
import gsap from 'gsap';

import flameVertex from '../shaders/About/flameVertex.glsl'
import flameFragment from '../shaders/About/flameFragment.glsl'



const AboutMe = () => {


    const textures = ['./noiseTextures/noise2Classic.png','./noiseTextures/noise3Classic.png','./noiseTextures/noise4Classic.png',  'img.JPG']
    const pointsRef = useRef(); // Reference to the points object
   
    



    
    const texture1 = useTexture(textures[0]);
    texture1.wrapS = THREE.RepeatWrapping
    texture1.wrapT = THREE.RepeatWrapping
    const texture2 = useTexture(textures[1]);
    texture2.wrapS = THREE.RepeatWrapping
    texture2.wrapT = THREE.RepeatWrapping
    const texture3 = useTexture(textures[2]);

    const texture4 = useTexture(textures[3])
    texture3.wrapS = THREE.RepeatWrapping
    texture3.wrapT = THREE.RepeatWrapping


    const fireUniforms = {
        uTime: {value : 0 },
        uNoiseTexture1: {value : texture1},
        uNoiseTexture2: {value : texture2},
        uNoiseTexture3: {value: texture3},
        uTexture: {value: texture4}
    }

    const gridUniforms = {
        uTime: {value : 0},
        uProgressToComplete: {value: 0.3},
        uFrequency: {value: 0}

      }

      

    const uniforms = { 
        uTime: { value: 0 },
        uRadius: { value: 1 }, // Add radius uniform
    };
    const parameters = { count: 2000, radius: 1 }; // Define count and radius

    useEffect(() => {

        gsap.to(gridUniforms.uProgressToComplete, {
            value: 1,
            duration: 3,
            ease: 'power1.inOut',
          });



        const geometry = pointsRef.current.geometry;

        // Initialize Float32 arrays
        const positions = new Float32Array(parameters.count * 3);
        const randoms = new Float32Array(parameters.count * 3);
        const sizes = new Float32Array(parameters.count);

        // Fill arrays with data (circular coordinates)
        for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3;

            // Circular coordinates in the x-y plane
            const angle = Math.random() * Math.PI * 2; // Random angle between 0 and 2π
            const radius = parameters.radius + Math.random() * 0.2; // Random radius

            // Convert polar to Cartesian coordinates (in x-y plane)
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            const z = Math.random() * 0.2; // Flat in the x-y plane

            // Set the starting positions
            positions[i3 + 0] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            // Set randomness for each point
            randoms[i3 + 0] = Math.random();
            randoms[i3 + 1] = Math.random();
            randoms[i3 + 2] = Math.random();

            // Set sizes with some variation
            sizes[i] = 0.5 + 0.5 * Math.random();
        }

        // Add attributes to geometry
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

        // Update the radius uniform
        uniforms.uRadius.value = parameters.radius;

        

       
    


        return () => {
            // Cleanup when component unmounts
            geometry.dispose();
        };
    }, [parameters.count, parameters.radius]);

    useFrame((state) => {
        uniforms.uTime.value = state.clock.getElapsedTime();
        gridUniforms.uTime.value = state.clock.getElapsedTime();
        fireUniforms.uTime.value = state.clock.getElapsedTime();




    });

    return (
        <>

        <mesh scale={2} position={[-2.4,0,0]}>
            <planeGeometry/>
            <shaderMaterial  transparent vertexShader={flameVertex} fragmentShader={flameFragment} uniforms={fireUniforms} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>

        <mesh scale={2} position={[2.4,0,0]}>
            <planeGeometry/>
            <shaderMaterial vertexShader={flameVertex} fragmentShader={flameFragment} uniforms={fireUniforms} transparent blending={THREE.AdditiveBlending} depthWrite={false}/>
        </mesh>
        <mesh position={[0,-2,0]} scale={5} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 5, 128, 128]} />
        <shaderMaterial
          vertexShader={groundVertex}
          fragmentShader={groundFragment}
          uniforms={gridUniforms}
          transparent
        />
      </mesh> 
        <points ref={pointsRef}>
            <bufferGeometry attach="geometry" />
            <shaderMaterial
                vertexShader={aboutVertex}
                fragmentShader={aboutFragment}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                uniforms={uniforms}
            />

        <Html distanceFactor={1.8} center>
            <div className="about-me-card">
                <h1 className="about-me-title">About Me</h1>
                <p>
                    I am a Creative Developer, Game Developer, Web Developer and Computer Graphics Engineer based in Islamabad, Pakistan, currently pursuing a degree in Computer Science at NUST. 
                </p>
                <p>
                    With a strong motivation to enhance my creative skills, I am particularly passionate about writing shaders and crafting visually captivating experiences. 
                </p>
               
            </div>
        </Html>
        </points>
        </>
       
    );
};

export default AboutMe;
