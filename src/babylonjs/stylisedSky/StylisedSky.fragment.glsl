precision highp float;

uniform vec3 _Colour1;
uniform vec3 _Colour2;

varying vec2 vUV;

void main(void) {
    vec3 col = mix(_Colour1, _Colour2, vUV.y);
    gl_FragColor = vec4(col, 1.0);
}