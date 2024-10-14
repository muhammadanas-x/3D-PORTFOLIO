

varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uTime;



void main() {
    // Get the color from the texture
    vec4 color = texture2D(uTexture, vUv);


    float stripes = step(fract(vUv.y * 20.),0.9);
    // Calculate the luminance (perceived brightness of the pixel)
    float luminance = dot(color.rgb, vec3(0.5, 0.5, 0.5));




    float final = luminance;

    // Apply the luminance to the target color
    vec3 newColor = vec3(0.0,1.0,1.0) * final;

    // Set the final color (with original alpha)
    gl_FragColor = vec4(newColor, color.a);
}