varying vec2 vUv;


void main() {

    vec2 uv = gl_PointCoord;

    float upperY = fract(vUv.y * 50.0);
    float upperX = fract(vUv.x * 50.0);
    upperX = step(upperX , 0.05);
    upperY = step(upperY , 0.05);

    float final = upperX + upperY;


    float d = length(uv - 0.5);

    d = 0.05 / d  - 0.1;

    d *= final;


    vec3 finalColor = vec3(0.0,1.0,1.0);






    // Set the final fragment color
    gl_FragColor = vec4(vec3(d * finalColor),d); // Full opacity
}
