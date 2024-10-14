varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;


uniform float uTime;
uniform sampler2D uNoiseTexture;



// Simplex Noise function
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                      -0.577350269189626, // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);

  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}





    // vec3 viewDirection = normalize(vPosition - cameraPosition);
    // vec3 normal = normalize(vNormal);

    // // ...
    // float fresnel = dot(viewDirection, normal) + 1.0;
    // fresnel = pow(fresnel, 2.0);



varying float vGlitchStrength;



void main() {
    // Define beam center at the middle of the UVs (along x-axis)
    

    float visiblePart = dot(vNormal , vec3(0.,1.0,0.));
    vec2 myCircleMask = vUv;
    myCircleMask -= 0.5;
    float maskVal = length(myCircleMask);
    maskVal = step(maskVal, 0.5); // Circular mask

    // Create a grid of points using UVs and fract for repeating pattern
    vec2 myCirclePointsUv = vUv;
    myCirclePointsUv *= 20.0;  // Scale up UV for multiple points
    vec2 gridUv = fract(myCirclePointsUv); // Repeating pattern

    float dist = distance(gridUv, vec2(0.5)); // Distance from point center

    // Define the radius of the points
    float radius = 0.3; 
    float circle = smoothstep(radius, radius - 0.5, dist); // Circular points
    circle *= 3.0; // Intensity scaling


    


    vec3 beam = fract(1.0 - (abs(snoise(vUv * 10.0) + uTime))) + vGlitchStrength * 50.0 * vec3(0.0,1.0,1.0);

    beam *= circle;
    gl_FragColor = vec4(vec3(beam), visiblePart);
}