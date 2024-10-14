
varying float vOpacity;
varying vec2 vUv;

uniform float uTime;

void main()
{

    float l = sin(sin(length(vUv - 0.5) * 3.0 + uTime) * 2.0) + 1.4;

    
    vec2 uv = gl_PointCoord.xy;

    float d = length(uv - 0.5);

    d = 0.05 / d - 0.1;


    gl_FragColor = vec4(vec3(0.0,1.0,1.0) , d * l );
}