



varying vec3 vNormal;
varying vec3 vPosition;


uniform float uTime;
void main()

{ 
    
    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing)
        normal *= - 1.0;


    

    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0) + 0.5;

    // Falloff
    float falloff = smoothstep(0.8, 0.2, fresnel);


    gl_FragColor = vec4(0.0,1.0,1.0,fresnel);
}