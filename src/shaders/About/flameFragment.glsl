varying vec2 vUv;

uniform float uTime;
uniform sampler2D uNoiseTexture1;
uniform sampler2D uNoiseTexture2;
uniform sampler2D uNoiseTexture3;
uniform sampler2D uTexture;


void main() {

    float colorIntensity = 10.0;
    vec2 uv = vUv;
    uv.x *= 2.0;
    uv.x -= 0.5;


    float r = texture2D(uTexture , vUv + vec2(0.09,0.0)).r * 3.0;
    // Calculate noise textures
    float d = texture2D(uNoiseTexture1, uv * 0.5 + vec2(0, fract(-uTime * 0.8))).r;
    float e = texture2D(uNoiseTexture2, uv * 0.8 + vec2(0, fract(-uTime + d * 0.9))).r;
    float f = texture2D(uNoiseTexture3, uv + vec2(0, fract(-uTime + e * 0.9))).r;
    float final = (pow(d * e * f,0.3) - 0.5) * colorIntensity;
    
    float lowerPart = final;
    lowerPart *= pow(1.0 - uv.y , 10.0) * pow(uv.y,0.5);

    // Orb mask parameters
    vec2 center = vec2(0.5, 0.5); // Center of the orb
    float radius = 0.5; // Radius of the orb
    float smoothness = 0.3; // Smoothness of the edge

    // Calculate distance from center
    float dist = length(uv  - center);

    // Create the smooth orb mask
    float mask = smoothstep(radius, radius - smoothness, dist)  + lowerPart;


    vec3 cyan = vec3(0.0,1.0,1.0);

    // Output the color with the mask applied
    gl_FragColor = vec4(vec3(cyan * mask * final), mask * final * r); // Output the texture color
}
