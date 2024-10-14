varying vec2 vUv;
uniform float uTime;



void main()
{

    float s = step(length(vUv - 0.5) * 2.0,0.8);
    float d = step(fract(length(vUv - 0.5) * 3.0 - uTime * 0.2), 0.05);



    float v = (vUv - 0.5) * 10.0;
    vec3 cyan = vec3(0.0,1.0,1.0);
    cyan *= d;
    gl_FragColor = vec4(vec3(length(v)),1.0);
}