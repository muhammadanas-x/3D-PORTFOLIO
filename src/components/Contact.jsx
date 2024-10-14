import { useFrame, useThree } from '@react-three/fiber';
import { Html, useGLTF, useTexture } from '@react-three/drei';
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

import earthVertex from '../shaders/Earth/vertex.glsl';
import earthFragment from '../shaders/Earth/fragment.glsl';


import logoVertex from '../shaders/Logo/vertex.glsl'
import logoFragment from '../shaders/Logo/fragment.glsl'
import logoFragment2 from '../shaders/Logo/fragment2.glsl'
import logoVertex2 from '../shaders/Logo/vertex2.glsl'
import { Bloom, EffectComposer } from '@react-three/postprocessing';

const Contact = () => {


    const linkedinTexture = useTexture(['./LogoTextures/LinkedinTexture.png','./LogoTextures/itchio.png']);


    const [isHovered , setIsHovered] = useState(false);

    const linkedinRef = useRef();
    const itchRef = useRef();
    const pointsRef = useRef();
    const parameters = { count: 1000, radius: 1 }; // Define count and radius
    const uniforms = { uTime: { value: 0 } , uLinkedinTexture: {value: linkedinTexture[0]} };
    const uniforms2 = { uTime: { value: 0 } , uItchIoTexture: {value: linkedinTexture[1]} };

    useEffect(() => {
        const geometry = pointsRef.current.geometry;

        // Initialize Float32 arrays
        const positions = new Float32Array(parameters.count * 3);
        const randoms = new Float32Array(parameters.count * 3);
        const sizes = new Float32Array(parameters.count);

        // Fill arrays with data (spherical coordinates)
        for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3;

            // Spherical coordinates
            const theta = Math.random() * Math.PI * 2; // Random angle between 0 and 2π
            const phi = Math.acos((Math.random() * 2) - 1); // Random angle between 0 and π
            const radius = parameters.radius;

            // Convert spherical to Cartesian coordinates
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            // Set positions
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

        return () => {
            // Cleanup when component unmounts
            geometry.dispose();
        };
    }, [parameters.count, parameters.radius]);


    
    useFrame((state) => {
        uniforms.uTime.value = state.clock.getElapsedTime();
        uniforms2.uTime.value = state.clock.getElapsedTime();

        const radius = 1.5; // Adjust radius of the circle


        const x = 1.3 + radius * Math.cos(uniforms.uTime.value) * 0.5
        const y = 0 + radius * Math.sin(uniforms.uTime.value) * 0.5;
        const z = 0;

        const x2 = 1.5 + radius * Math.cos(uniforms.uTime.value + 180) * 0.5
        const y2 = 0 + radius * Math.sin(uniforms.uTime.value + 180) * 0.5;
        const z2 = 0;



        linkedinRef.current.position.set(x,y,z);
        itchRef.current.position.set(x2,y2,z2);

        
    });
    return (
        <>
            <points ref={pointsRef} position={[0,0,0]}>
                <bufferGeometry attach="geometry" />
                <shaderMaterial
                    uniforms={uniforms}
                    vertexShader={earthVertex}
                    fragmentShader={earthFragment}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        {/* <group>
        <mesh scale={0.55} ref={linkedinRef} position={[-1, 1, 0]}>
                <planeGeometry />
                <shaderMaterial transparent vertexShader={logoVertex} fragmentShader={logoFragment} uniforms={uniforms} />
                <Html distanceFactor={3} position={[0, 0.65, 0]} center>
                    <div className="glowing-text">
                            <h2>LinkedIn</h2>
                    </div>
                </Html>


                <Html distanceFactor={2} scale={0.2} position={[0, -0.65, 0]} center>
                    <div className="neon-button-container">
                        <button className="neon-button">Click</button>
                    </div>
                </Html>
            </mesh>

            <mesh scale={0.55} ref={itchRef} position={[1, 1, 0]}>
                <planeGeometry />
                <shaderMaterial transparent vertexShader={logoVertex2} fragmentShader={logoFragment2} uniforms={uniforms2} />
                <Html distanceFactor={3} position={[0, 0.65 , 0]} center>
                    <div className="glowing-text">
                        <h2>itch.io</h2>
                    </div>
                </Html>

                <Html distanceFactor={2} position={[0, -0.65, 0]} center>
                    <div className="neon-button-container">
                        <button className="neon-button">Click</button>
                    </div>
                </Html>
            </mesh>
        </group> */}
            
            

            {/* Contact Form */}
            
        </>
    );
};

export default Contact;
