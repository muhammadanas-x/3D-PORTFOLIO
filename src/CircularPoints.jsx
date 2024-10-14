import { OrbitControls } from '@react-three/drei'
import { useRef, useState } from 'react'
import { Points, BufferGeometry, Float32BufferAttribute, PointsMaterial } from 'three'
import { useFrame, extend, useThree } from '@react-three/fiber'
import shockwaveVertex from '../src/shaders/shockwave/vertex.glsl'
import shockwaveFragment from '../src/shaders/shockwave/fragment.glsl'



let myUniforms = {
    uTime: { value: 0.0 }
  }



function generateCirclePoints(radiusLevels, count) {
  const positions = []
  radiusLevels.forEach((radius) => {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const x = radius * Math.cos(angle)
      const y = radius * Math.sin(angle)
      const z = 0 // 2D circles, so z remains 0
      positions.push(x, y, z)
    }
  })
  return new Float32Array(positions)
}

export default function CircularPoints() {
  const pointsRef = useRef()
  const radiusLevels = [1, 2, 3, 4]
  const pointsPerCircle = 100
  const totalPointsCount = radiusLevels.length * pointsPerCircle
  const targetPositions = generateCirclePoints(radiusLevels, pointsPerCircle)
  const [currentPositions] = useState(() => new Float32Array(totalPointsCount * 3).fill(0))
  const delays = radiusLevels.map((_, i) => i * 1.0)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    myUniforms.uTime.value = time // Update the uniform

    const speed = 0.01


    for (let i = 0; i < totalPointsCount; i++) {
      const radiusIndex = Math.floor(i / pointsPerCircle)
      const delay = delays[radiusIndex]

      if (time > delay) {
        const idx = i * 3

        currentPositions[idx] += (targetPositions[idx] - currentPositions[idx]) * speed
        currentPositions[idx + 1] += (targetPositions[idx + 1] - currentPositions[idx + 1]) * speed
        currentPositions[idx + 2] += (targetPositions[idx + 2] - currentPositions[idx + 2]) * speed
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })


  return (
    <>
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />
      <OrbitControls />

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={currentPositions.length / 3}
            array={currentPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={shockwaveVertex}
          fragmentShader={shockwaveFragment}
          uniforms={myUniforms}
        
        />
      </points>

      </>
  )
}
