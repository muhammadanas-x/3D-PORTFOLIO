varying vec2 vUv;

uniform float uProgressToComplete;

uniform float uTime;
void main()
{ 
    // Create a circle mask from UV coordinates
    vec2 myCircleMask = vUv;
    myCircleMask -= 0.5;
    float maskVal = length(myCircleMask);
    maskVal = step(maskVal, uProgressToComplete - 0.3); // Circular mask based on progress

    vec2 myCirclePointsUv = vUv;
    myCirclePointsUv *= 20.0;  // Scale up UV for multiple points
    vec2 gridUv = fract(myCirclePointsUv + vec2(0,uTime) ); // Repeating pattern

    float dist = pow(1.0 - distance(gridUv, vec2(0.5)), uProgressToComplete * 9.0 + 3.0); // Distance from point center




    vec3 color = vec3(0.0, 1.0, 1.0);

    float final = dist * maskVal;

    gl_FragColor = vec4(vec3(final * color), final);
}