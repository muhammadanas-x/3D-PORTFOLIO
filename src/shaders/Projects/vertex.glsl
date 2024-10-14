varying vec2 vUv;


uniform float uTime;


void main()
{
    vUv = uv;
    vec3 newPosition = position;


    float value = fract(uTime);

    float distanceFromCenter = length(newPosition.x) ; // Assuming plane is on the XY plane

    float equationDisplacement = min(max(pow(distanceFromCenter - 1.0,3.0),0.0),2.0 );


    newPosition.z += equationDisplacement;


    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition , 1.0);
}