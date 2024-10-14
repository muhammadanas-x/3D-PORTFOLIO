uniform sampler2D uCrackedTexture;
uniform float uTime;

varying vec2 vUv;

// Simple 2D random noise function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 2D noise function based on random function
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners of the cell
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);

    // Mix the results
    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}



mat2 getRotationMatrix(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

void main() {
    vec2 centeredUv = vUv - 0.5;

    float angle = uTime * 0.5; // Rotate over time
    mat2 rotationMatrix = getRotationMatrix(angle);
    vec2 rotatedUv = rotationMatrix * centeredUv;

    rotatedUv += 0.5;

    float s = texture2D(uCrackedTexture, rotatedUv).r;


    float d = step(fract(length(centeredUv) * 20.0 - uTime * (1.0 - length(centeredUv) * 0.001)),0.1);



    float final = d * s ;


    vec3 finalColor = vec3(0.0,1.0,1.0) * final;



    // Set the fragment color based on the texture
    gl_FragColor = vec4(vec3(finalColor), final);
}