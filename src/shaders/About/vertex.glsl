varying vec2 vUv;

uniform float uTime;
uniform float uRadius; // Add uniform for radius
uniform float uFrequency;

attribute float aRandom;
attribute float aSize;

// GLSL Simplex Noise Function for 2D
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float simplexNoise2D(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0 - sqrt(3.0)) / 6.0
                      0.366025403784439,  // 0.5 * (sqrt(3.0) - 1.0)
                      -0.577350269189626, // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i = floor(v + dot(v, C.yy) );
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec2 x1 = x0.xy + C.xx - i1;
  vec2 x2 = x0.xy + C.zz;

  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2)), 0.0);
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.y = a0.y * x1.x + h.y * x1.y;
  g.z = a0.z * x2.x + h.z * x2.y;
  return 130.0 * dot(m, g);
}

vec2 getTangentU(float u) {
    return vec2(-sin(u), cos(u));
}

void main() {
    vec2 circlePosition = normalize(vec2(position.x, position.y));

    float u = atan(circlePosition.y, circlePosition.x);  // angle for x-y plane

    vec2 tangentU = getTangentU(u); 

    float factorU = 0.1;
    float factorV = 0.0; 
    vec2 tangentVector = factorU * tangentU + normalize(position.xy + tangentU) * 0.01 ;

    float noise = simplexNoise2D(position.xy);

    float value = aRandom * noise + uTime * noise;

    // Use uRadius instead of hardcoded radius
    vec2 displacedPosition = circlePosition * uRadius + tangentVector * sin(value ) * 5.0;

    vec3 transformedPosition = vec3(displacedPosition, 0.0);

    gl_PointSize = 200.0 * (aSize);
    gl_PointSize *= 1.0 / -(viewMatrix * modelMatrix * vec4(position, 1.0)).z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformedPosition, 1.0);
}
