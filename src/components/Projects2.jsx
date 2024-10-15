import { useFrame, useThree } from '@react-three/fiber'
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import particlesVertex from '../shaders/Projects2/vertex.glsl'
import particlesFragment from '../shaders/Projects2/fragment.glsl'
import flameVertex from '../shaders/Projects2/flameVertex.glsl'
import flameFragment from '../shaders/Projects2/flameFragment.glsl'


import { gsap } from 'gsap'
import { Html, useTexture } from '@react-three/drei'
import { Link } from 'react-router-dom'



const Projects2 = () => {


    const isAnimating = useRef(false);
    const texturePaths =  [
         "./projectsImages/Dreamscape.png" , 
        "./projectsImages/r3fporshe.jpeg",
        './projectsImages/shrinkingPlanet.png',
        './projectsImages/javafxGameEngine.png',
        './projectsImages/cosmicdefense.png',
        './projectsImages/CarShowroom.jpg',
        './projectsImages/Larope.jpg',
        './projectsImages/MassEjection.jpg',
        './projectsImages/RushCycle.jpg',
        './projectsImages/DontGetFried.jpg'
    ]


    const textures = ['./noiseTextures/noise2Classic.png','./noiseTextures/noise3Classic.png','./noiseTextures/noise4Classic.png']


    const flameRef = useRef();

    
    const texture1 = useTexture(textures[0]);
    texture1.wrapS = THREE.RepeatWrapping
    texture1.wrapT = THREE.RepeatWrapping
    const texture2 = useTexture(textures[1]);
    texture2.wrapS = THREE.RepeatWrapping
    texture2.wrapT = THREE.RepeatWrapping
    const texture3 = useTexture(textures[2]);
    texture3.wrapS = THREE.RepeatWrapping
    texture3.wrapT = THREE.RepeatWrapping

    
    const fireUniforms = useRef({
        uTime: { value: 0 },
        uNoiseTexture1: { value: texture1 },
        uNoiseTexture2: { value: texture2 },
        uNoiseTexture3: { value: texture3 },
    }).current;


    const titles = [
      "DreamScape",
      "React Three Fiber Porshe Template",
      "Shrinking Planet",
      "JavaFX Game Engine 2D",
      "Cosmic Defense",
      "3D Car Showroom",
      "Larope",
      "Mass Ejection",
      "RushCycle",
      "Don't Get Fried",
  ];
  const links = [
    'https://midnyy.itch.io/',
    'https://github.com/muhammadanas-x/React-three-fiber-Car-scene',
    'https://github.com/muhammadanas-x/Shrinking-Planet',
    'https://www.linkedin.com/posts/muhammad-anas-1a9824262_excited-to-share-my-second-semester-project-activity-7101169026919202816-QIzI?utm_source=share&utm_medium=member_desktop',
    'https://github.com/muhammadanas-x/Cosmic-Defense',
    'https://github.com/muhammadanas-x/Car-Showroom',
    'https://midnyy.itch.io/',
    'https://midnyy.itch.io/',
    'https://midnyy.itch.io/',
    'https://github.com/muhammadanas-x/Don-t-Get-Fried'
]
  const descriptions = [
      "This Game Was made for Brackeys Game Jam 2024.1",
      "This is just a simple front end Website made with React Three Fiber",
      "This Game Was made as an inspiration from Brackeys Channel",
      "This is my Second Semester Project which inherits python code with java code at runtime and display Graphics , JavaFX Game Engine 2D",
      "This Game was made for a local jam  'Rookie Game Jam 2023' initiated by Mindstorm Labs Lahore",
      "This Project was made in React Three Fiber with tech stack NEXT JS",
      "This Project was made for Score Space Game Jam which lasted for 3 days",
      "This Project was made for GMTK Game Jam 2023 for the theme 'Scale'",
      "This Game was made for Chicago on spot Game Jam which lasted for 3 hours",
      "This Game was made for a local jam  'Rookie Game Jam 2024' initiated by Mindstorm Labs Lahore",

  ];
  
  const htmlContent = titles.map((title, index) => ({
      title: title,
      description: descriptions[index],
      links: links[index],
      position: [-2.4, 0.6 + index * 2.4, 0], // Adjust the position dynamically
  }));

    const { camera, renderer } = useThree();
    camera.position.set(0,1,4)
    const particlesRef = useRef();
    const htmlRef = useRef(); // Create a ref for the Html element


    const [index , setIndex ] = useState(0)


    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: Math.min(window.devicePixelRatio, 2)
    };

    // Create the particles geometry
    const particlesGeometry = new THREE.PlaneGeometry(2, 2, 128, 128);
    particlesGeometry.setIndex(null);
    particlesGeometry.deleteAttribute('normal');

    // Access the position attribute of the geometry
    const positionArray = particlesGeometry.attributes.position.array;
    const intensitiesArray = new Float32Array(particlesGeometry.attributes.position.count);
    const anglesArray = new Float32Array(particlesGeometry.attributes.position.count);
    const originalPositions = new Float32Array(positionArray.length); // Array to store original positions

    // Store original positions and apply randomness to the positions
    for (let i = 0; i < particlesGeometry.attributes.position.count; i++) {
        originalPositions[i * 3 + 0] = positionArray[i * 3 + 0]; // Store original x position
        originalPositions[i * 3 + 1] = positionArray[i * 3 + 1]; // Store original y position
        originalPositions[i * 3 + 2] = positionArray[i * 3 + 2]; // Store original z position

        // Apply randomness to the current positions
        positionArray[i * 3 + 0] += (Math.random() - 0.5) * 10.0; // Random x position
        positionArray[i * 3 + 1] += (Math.random() - 0.5) * 10.0; // Random y position
        positionArray[i * 3 + 2] += (Math.random() - 0.5) * 10.0; // Random z position

        intensitiesArray[i] = Math.random();
        anglesArray[i] = Math.random() * Math.PI * 2;
    }

    // Update the position attribute
    particlesGeometry.attributes.position.needsUpdate = true;

    // Set the original position attribute to pass to the shader
    particlesGeometry.setAttribute('aOriginalPositions', new THREE.BufferAttribute(originalPositions, 3)); // Store as vec3 in shader
    particlesGeometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensitiesArray, 1));
    particlesGeometry.setAttribute('aAngle', new THREE.BufferAttribute(anglesArray, 1));

    // Create the shader material
    const particlesMaterial = new THREE.ShaderMaterial({
        vertexShader: particlesVertex,
        fragmentShader: particlesFragment,
        uniforms: {
            uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
            uPictureTexture: new THREE.Uniform(new THREE.TextureLoader().load("./projectsImages/Dreamscape.png")),
            uTime: { value: 0 },
            uProgress: { value: 0 }, // Initial progress value,
            uBool: {value: false}
        },
        blending: THREE.AdditiveBlending,
    });

    // Handle window resizing
    window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

        // Update resolution uniform
        particlesMaterial.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);

        // Update camera and renderer
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(sizes.pixelRatio);
    });

    // GSAP animation for uProgress
    useEffect(() => {
        gsap.to(particlesMaterial.uniforms.uProgress, {
            value: 1, // Animate from 0 to 1
            duration: 3, // 3 seconds duration
            ease: "power2.inOut" // Optional easing function
        });


        gsap.to(flameRef.current.scale, {
         
            x: 1, // Scale x to 1
            y: 1, // Scale y to 1
            z: 1, // Scale z to 1
            duration: 3, // 3 seconds duration
            ease: "power2.inOut", // Optional easing function
            onComplete: () => {
                isAnimating.current = false;
            }
        });





    }, [particlesMaterial.uniforms.uProgress]); // Run once when the component is mounted





    useEffect(() => {

        const textureLoader = new THREE.TextureLoader();
        particlesMaterial.uniforms.uPictureTexture.value = textureLoader.load(texturePaths[index % texturePaths.length])


    }, [index]); // This will log the index whenever it changes

        // Update the index

        const handleRightArrowClick = () => {

            if(isAnimating.current) return;

            isAnimating.current = true;
            if (index + 1 % texturePaths.length == 0) {
                gsap.to(htmlRef.current.position, {
                    y: '+=12',
                    duration: 1,
                    ease: 'power2.out'
                });
            } else {
                gsap.to(htmlRef.current.position, {
                    y: '-=2.4', // Adjust the y value by 1 unit (you can tweak this)
                    duration: 1, // Duration of the animation in seconds
                    ease: 'power2.out' // Optional easing for a smoother effect
                });
            }

            flameRef.current.scale.set(10,1,10);
        
            // Animate flame scale from 5 to 1
            gsap.to(flameRef.current.scale, {
                x: 1, // Scale x to 1
                y: 1, // Scale y to 1
                z: 1, // Scale z to 1
                duration: 1, // Duration of the animation in seconds
                ease: "power2.inOut", // Optional easing function
               
            });
        
            setIndex((prevIndex) => (prevIndex + 1) % texturePaths.length); // Increment index and wrap around
        };

  const handleLeftArrowClick = () => {

    if(isAnimating.current) return;
    isAnimating.current = true;

    gsap.to(htmlRef.current.position, {
        y: '+=2.4', // Decrease the y value by 1 unit (tweak this as needed)
        duration: 1, // Duration of the animation in seconds
        ease: 'power2.out' // Optional easing for smooth effect
    });

    flameRef.current.scale.set(10,1,10)



    gsap.to(flameRef.current.scale, {
        x: 1, 
        y: 1, 
        z: 1, 
        duration: 1, // Duration of the animation in seconds
        ease: "power2.inOut", // Optional easing function
      
    });

    setIndex((prevIndex) => (prevIndex - 1 + texturePaths.length) % texturePaths.length); // Decrement and wrap around
};
    

    useFrame((state) => {
        if (flameRef.current || particlesRef.current) {
            particlesMaterial.uniforms.uTime.value = state.clock.getElapsedTime();
            fireUniforms.uTime.value = state.clock.getElapsedTime();

        }


    });
    
    
    return (
        <>

            <mesh ref={flameRef} scale={[5,1,5]} position={[1.2, -.5, -0.6]}>
                <cylinderGeometry args={[5,1,2,64,64,true,3.14,6.28]} 
                />
                <shaderMaterial side={THREE.DoubleSide} transparent vertexShader={flameVertex} fragmentShader={flameFragment} uniforms={fireUniforms} />
            </mesh>
            <points position={[1,0,0]} rotation={[0,-Math.PI / 5 , 0]} ref={particlesRef} geometry={particlesGeometry} material={particlesMaterial} />
            <group position={[-0.7,0,0]} ref={htmlRef}>
            {htmlContent.map((content, index) => (

            <Html key={index} position={content.position}>
                <div style={{ textAlign: 'center', color: '#00ffff', fontFamily: 'Arial, sans-serif' , width: "500px"}}>
                    <h1
                        style={{
                            fontSize: '36px', // larger title
                            marginBottom: '10px', // space between title and description
                            textShadow: '0 0 10px #00ffff', // neon glow effect
                        }}
                    >
                        {content.title}
                    </h1>
                    <p
                        style={{
                            fontSize: '14px', // normal size for the description
                            color: '#00ffff', // neon cyan text color
                            marginBottom: '20px', // space between description and button
                            
                        }}
                    >
                        {content.description}
                    </p>
                    {/* Button */}
                    <a
                    href={content.links}
                        style={{
                            backgroundColor: '#1a1a1a', // dark gray/blackish background
                            color: '#00ffff', // neon cyan text
                            border: '2px solid #00ffff', // cyan border
                            padding: '10px 20px', // padding for a nice button size
                            fontSize: '18px', // larger text for clarity
                            borderRadius: '10px', // rounded corners
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#2b2b2b')} // slight hover effect
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#1a1a1a')} // reset background on hover leave
                    >
                        Show Details
                    </a>
                </div>
            </Html>
        ))}
            </group>
            


            
    <Html  position={[-3.5,0,0]}>
     {/* Arrow icons */}
      <span
        style={{
          fontSize: '32px', // larger size for visibility
          cursor: 'pointer',
          marginRight: '30px',
          color: '#00ffff', // neon cyan color
          textShadow: '0 0 5px #00ffff', // neon glow effect
        }}
        onClick={handleLeftArrowClick}
      >
        &#9664; {/* Left arrow symbol */}
      </span>
      </Html>
        <Html position={[3.2,0,0]}>
        <span
        style={{
          fontSize: '32px', // larger size for visibility
          cursor: 'pointer',
          marginLeft: '30px',
          color: '#00ffff', // neon cyan color
          textShadow: '0 0 5px #00ffff', // neon glow effect
          borderColor: 'cyan',
          borderRadius: '4px'
        }}
        onClick={handleRightArrowClick}
      >
        &#9654; 
      </span>
</Html>
        </>
    )
   
}

export default Projects2;
