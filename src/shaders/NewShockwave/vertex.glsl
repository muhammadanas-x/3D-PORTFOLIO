varying vec2 vUv;        // Passing UV coordinates to the fragment shader
uniform float uTime;     // Time uniform
uniform float uFrequency; // Audio frequency uniform
uniform float uRingCount; // Number of rings

void main()
{
    // Calculate the distance from the center of the plane (on the XY plane)
    vec3 newPosition = position;
    float distanceFromCenter = length(newPosition.xy); // Assuming plane is on the XY plane

    vec2 positionUv = uv;

    // Modulate the displacement based on audio frequency
    float audioDisplacement = uFrequency * 0.1; // Scale the frequency value for more control

    float totalDisplacement = 0.0; // Variable to accumulate displacement from all rings

    // Loop through multiple rings
    for (float i = 1.0; i < 20.0; i += 1.0) {
        // Add some small offset to avoid overlapping issues
        float ringOffset = i * 0.2;
        
        // Each ring has a different time offset based on the loop index
        float ringRadius = abs(sin(uTime * 0.2 - i) * 3.0) + ringOffset; // More gradual time-based ring radius with offset per ring
        
        // Displace particles based on their distance from each ring's radius
        float displacement = smoothstep(ringRadius - 0.4, ringRadius + 0.4, distanceFromCenter) * 0.3; // Smoothing for ring width

        // Accumulate displacement for each ring
        totalDisplacement += displacement * (0.5 + displacement); // Z displacement based on audio frequency and smoothstep
    }

    // Limit total displacement to avoid overflow issues
    totalDisplacement = clamp(totalDisplacement, 0.0, 5.0);

    // Apply total displacement to the position
    newPosition.z += totalDisplacement;

    // Transform the model position to world space
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

    // Apply view and projection matrices
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Pass UVs to the fragment shader
    vUv = uv;
}
