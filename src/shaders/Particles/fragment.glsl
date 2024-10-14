varying vec2 vUv;

varying vec3 vColor;
varying vec3 vTextureColor;


uniform float uTime;
void main()
{

    vec3 textureMap = vTextureColor.rgb;

    vec2 myUv = vUv;
    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - vec2(0.5));


    float d = length(myUv - 0.5) * 3.0;
    d = step(fract(d - uTime),0.1);


    vec3 cyanColor = vec3(0.0,1.0,1.0);

    cyanColor *= d;



    if(distanceToCenter > 0.9)
        discard;

    textureMap += cyanColor;
    

    gl_FragColor = vec4(vec3(textureMap), 1.0);
}