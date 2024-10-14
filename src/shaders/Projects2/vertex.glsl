varying vec2 vUv;

uniform vec2 uResolution;
uniform float uProgress;


attribute vec3 aOriginalPositions;
attribute float aIntensity;
attribute float aAngle;


uniform float uTime;
void main()
{
    vec3 newPosition = position;

    vec3 finalPosition = mix(newPosition , aOriginalPositions , uProgress);



    vec3 modelPosition = (modelMatrix * vec4(finalPosition , 1.0)).xyz;

    float elevation = sin(modelPosition.x * 2.0 + uTime) * sin(modelPosition.y * 5.0 + uTime) * 0.15;

    modelPosition.z += elevation;

    vec4 viewPosition = viewMatrix * vec4(modelPosition,1.0);



    gl_Position = projectionMatrix * viewPosition;


    gl_PointSize = 0.03 * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);


    vUv = uv;
}