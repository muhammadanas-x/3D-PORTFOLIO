varying vec2 vUv;
uniform float uTime;
uniform sampler2D uItchIoTexture;

void main() {
    float speed = 5.0;

    vec2 myUv = vUv;

    vec2 ringUv = myUv - vec2(0.5);


    float c = pow((1.0 - abs((length(ringUv)) - 0.45)),15.0);



    



    float color = 1.0 - texture2D(uItchIoTexture, myUv).r;


    float d = color;


    d *= step(fract(vUv.y * 20.0 + uTime * speed),0.1);

    d += c;


    

    vec3 myColor = vec3(0.0,1.0,1.0) * d;
    // Set the final color
    gl_FragColor = vec4(vec3(myColor), d);
}
