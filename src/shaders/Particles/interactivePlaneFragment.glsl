varying vec2 vUv;


void main()
{
    
    vec2 uv = (vUv - 0.5);

    float len = length(uv) * 10.0;
    len = fract(len);


    gl_FragColor = vec4(vec2(uv),1.0,1.0);
}