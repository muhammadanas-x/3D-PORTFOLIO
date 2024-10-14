varying vec2 vUv;


void main()
{
    vec4 modelPosition = modelMatrix * vec4(position , 1.0);

    float elevation = sin(modelPosition.x * 2.0) * sin(modelPosition.z * 5.0) * 0.1;

    modelPosition.z += elevation;



    vUv = uv;
}