

uniform float uTime;

varying vec2 vUv; // Pass UVs to the fragment shader

mat2 getRotationMatrix(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

void main() {
    vec3 newPosition = position; // Start with the original position

    // Rotate the position in the XY plane around the origin
    float angle = uTime * 0.5; // Rotation over time
    mat2 rotationMatrix = getRotationMatrix(angle);
    newPosition.xy = rotationMatrix * newPosition.xy;

    // Adjust the Z axis to create the emerging wave effect
    float wave = sin(length(newPosition.xy) * 20.0 - uTime) * 0.1;
    newPosition.z += wave;  // Apply the wave effect along the z-axis

    // Pass UVs to the fragment shader
    vUv = uv;

    // Final transformed position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
