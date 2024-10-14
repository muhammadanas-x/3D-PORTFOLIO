varying vec2 vUv;

uniform float uFrequency;


void main()
{


    vec2 uv = gl_PointCoord;


    float d = length(uv - 0.5);

    d = (0.05 / d  - 0.1 );


    vec3 finalColor = vec3(0.0,1.0,1.0) ;

    gl_FragColor = vec4(vec3(finalColor * d), d);
}