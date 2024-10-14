uniform float uTime;



varying vec2 vUv;


float random2D(vec2 value) {
    return smoothstep(fract(sin(dot(value.xy, vec2(12.9898, 78.233))) * 43758.5453123),0.01,0.2);
}



void main() {
  

  float distortEdges = 0.5;
  vec3 newPosition = position;

  

  vec4 modelPosition = (modelMatrix * vec4(position , 1.0));

  float glitchTime = uTime - length(position.xy);

  float glitchStrength = sin(glitchTime) + sin(glitchTime * 2.45) + sin(glitchTime * 10.45) + sin(glitchTime * 3.45);
 
 
  glitchStrength /= 3.0;
  glitchStrength = smoothstep(0.3, 0.6, glitchStrength);
  glitchStrength *= 0.1;


   modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength ;
   modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;



  // Apply transformation matrices
  gl_Position = projectionMatrix * viewMatrix * modelPosition;


  vUv = uv;
}