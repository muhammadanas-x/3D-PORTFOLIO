import React from 'react'
import UpperSphereShaderVertex from '../shaders/UpperPageSphere/vertex.glsl' 
import UpperSphereShaderFragment from '../shaders/UpperPageSphere/fragment.glsl' 
import { Center, Float, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';




let myUniforms = {
    uTime: {value : 0},

}
const UpperPageSpheres = ( ) => {


  

    useFrame((state) => {
        myUniforms.uTime.value = state.clock.getElapsedTime();
    })


    const list = ["Projects" , "About Me" , "Contact Me"]

    const radius = 7; // Adjust the radius as needed
    const sphereCount = 3;
    
    // Create an array of sphere positions
    const spheres = Array.from({ length: sphereCount }).map((_, index) => {
      const angle = (index * 120) * (Math.PI / 180); // Convert degrees to radians
      return {
        position: [
          radius * Math.cos(angle), // X position
          4, // Y position
          radius * Math.sin(angle), // Z position
        ]
      };
    });
  
    return (
        <group>
          {spheres.map((sphere, index) => (
            <mesh key={index} scale={1} position={sphere.position}>
              <sphereGeometry args={[1.5, 32, 32]} /> {/* Adjust size and segments as needed */}
              <shaderMaterial
                vertexShader={UpperSphereShaderVertex}
                fragmentShader={UpperSphereShaderFragment}
                transparent
                uniforms={myUniforms}
              />
              <Center>
              <Html position={[0, 0, 0]} center>
                <div
                  style={{
                    color: 'white',
                    fontSize: '25px',
                    width: '150px',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50px' // Adjust height as needed to balance vertically
                  }}
                >
                 <button
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px solid cyan',
                    color: 'cyan',
                    padding: '15px', // You can adjust padding if needed
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    width: '90px', // Set the width to form a circle
                    height: '90px', // Set the height to match the width
                    borderRadius: '50%', // Ensures the button is a circle
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = 'cyan', e.target.style.color = 'white')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent', e.target.style.color = 'cyan')}
                >
                  {list[index]}
                </button>
                </div>
              </Html>
            </Center>
              
            </mesh>
          ))}
        </group>
      );
  };


export default UpperPageSpheres