varying vec3 vPosition;
varying vec3 vNormal;

uniform float uTime;


// Helper function to generate random vec2 based on input vector
vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1, 311.7)),
              dot(st, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}
// Simple 2D noise function (pseudo-random noise)
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners of the grid
    float a = dot(random2(i), f - vec2(0.0, 0.0));
    float b = dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
    float c = dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
    float d = dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));

    // Interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);

    // Mix results
    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}



void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    // Apply noise using uTime for animation
    vec2 pos = position.xz;
    float n = noise(pos +  uTime);


    vec3 newPosition = position + normal * n * 0.4;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition , 1.0);

    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;
}
