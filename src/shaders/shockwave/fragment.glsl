uniform float uTime;



void main() 
{


  vec2 myuv = gl_PointCoord.xy;
  myuv -= 0.5;
  myuv *= 2.0;

  float d = 1.0 - length(myuv);
  d = pow(d , 0.01);

  vec3 color = vec3(1.0 ,cos(uTime), sin(uTime)) * d;

  gl_FragColor = vec4(color,1.0); // Cyan color
}
