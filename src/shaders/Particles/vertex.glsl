varying vec2 vUv;

uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;

attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;
varying vec3 vTextureColor;


uniform float uTime;



void main()

{


 
    
    vec3 modelPosition = (modelMatrix * vec4(position , 1.0)).xyz;

    float displacementIntensity = texture(uDisplacementTexture, uv).r;
    displacementIntensity = smoothstep(0.1, 0.3, displacementIntensity);

    vec3 displacement = vec3(
        cos(aAngle) * 0.1,
        sin(aAngle) * 0.1,
        1.0
    );


    displacement = normalize(displacement);
    displacement *= displacementIntensity * 0.1;
    
    modelPosition += displacement;


    float elevation = sin(modelPosition.x * 2.0 + uTime) * sin(modelPosition.y * 5.0 + uTime) * 0.15;

    modelPosition.z += elevation;
    vec4 viewPosition = viewMatrix * vec4(modelPosition,1.0);
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Picture
    float pictureIntensity = texture(uPictureTexture, uv).r;

    // Point size
    gl_PointSize = 20.0;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Varyings
    vColor = vec3(pow(pictureIntensity, 2.0));

    vTextureColor = texture(uPictureTexture, uv).rgb;



    vUv = uv;
}