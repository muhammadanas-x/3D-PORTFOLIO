uniform float uTime;



void main() {

  vec3 pos = position;
  vec4 modelPosition = modelMatrix * vec4(position , 1.0);

  vec4 mvPosition = viewMatrix * modelPosition;


  // Set point size (you can dynamically control this if needed)
  gl_PointSize = 5.0;

  // Transform the vertex position to screen space
  gl_Position = projectionMatrix * mvPosition;
}
