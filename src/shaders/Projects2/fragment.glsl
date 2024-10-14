varying vec2 vUv;
uniform sampler2D uPictureTexture;


uniform float uTime;


void main()
{


    vec2 uv = gl_PointCoord;
    vec4 picture = texture2D(uPictureTexture , vUv);

    float distanceToCenter = length(uv - vec2(0.5));


    float value = step(fract(length(vUv - 0.5) * 3.0 + uTime),0.1);
    vec3 color = vec3(0.0,1.0,1.0);
    
    float d = length(uv - 0.5);

    d = 0.9 / d  - 0.1;


 
    gl_FragColor = vec4(picture.rgb + color * value, 1.0);

}