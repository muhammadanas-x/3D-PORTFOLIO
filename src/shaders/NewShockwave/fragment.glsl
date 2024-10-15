varying vec2 vUv;

uniform float uFrequency;
uniform float uTime;

// Helper function to create a neon color ramp
vec3 neonPalette(float t) {
    // Define a few neon colors
    vec3 color1 = vec3(0.0, 1.0, 1.0); // Cyan
    
    return color1;
}

void main()
{
    // Create a circle mask from UV coordinates
    vec2 myCircleMask = vUv;
    myCircleMask -= 0.5;
    float maskVal = length(myCircleMask);
    maskVal = step(maskVal, 0.5); // Circular mask

    // Create a grid of points using UVs and fract for repeating pattern
    vec2 myCirclePointsUv = vUv;
    myCirclePointsUv *= 50.0;  // Scale up UV for multiple points
    vec2 gridUv = fract(myCirclePointsUv); // Repeating pattern

    float dist = distance(gridUv, vec2(0.5)); // Distance from point center

    // Define the radius of the points
    float radius = 0.3; 
    float circle = smoothstep(radius, radius - 0.5, dist); // Circular points
    circle *= 3.0; // Intensity scaling

    // Create a radial animation (ring effect) with uTime
    vec2 myRadiusUv = vUv;
    myRadiusUv -= 0.5;
    myRadiusUv *= 2.0;

    float totalRings = 0.0;
    for(float j = 0. ;  j < 5.0 ; j++)
    {
        float d = abs(sin(length(myRadiusUv * j) - uTime * 0.2)); // Time-based animation
        d = 1.0 - smoothstep(0.1, 0.4, d); 
        d = pow(d, 10.0); // Sharpness of the ring effect

        totalRings += d;
    }

    // Apply the circular pattern and mask to the ring animation
    totalRings *= circle; 
    totalRings *= maskVal; // Mask the effect inside a circle

    // Normalize totalRings to the range [0, 1] for color mapping

    // Apply the neon color palette based on totalRings
    vec3 cyanColor = vec3(0.0,1.0,1.0);

    cyanColor *= totalRings;

    // Output the final color with neon effect
    gl_FragColor = vec4(cyanColor, totalRings);
}
