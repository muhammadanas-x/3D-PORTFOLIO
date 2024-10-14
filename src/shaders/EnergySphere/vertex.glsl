uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vGlitchStrength;

float random2D(vec2 value) {
    return fract(sin(dot(value.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vUv = uv;

    // Model position transformation
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Normal transformation
    vNormal = normal; // Transforming normal to view space

    // Glitch effect based on time and position
    float glitchTime = uTime + modelPosition.y;
    float glitchStrength = sin(glitchTime) + sin(glitchTime * 2.45) + sin(glitchTime * 10.45) + sin(glitchTime * 3.45);
    
    glitchStrength /= 2.0;
    glitchStrength = smoothstep(0.3, 1.0, glitchStrength);
    glitchStrength *= 0.2;

    // Apply the glitch displacement
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;

    // Pass the final position to the fragment shader
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;

    // Final position
    gl_Position = projectionMatrix * modelViewMatrix * modelPosition;

    vGlitchStrength = glitchStrength;
}
