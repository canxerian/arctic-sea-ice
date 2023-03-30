precision highp float;

uniform vec3 _Colour1;
uniform vec3 _Colour2;

uniform vec3 _CamPos;

varying vec2 vUV;
varying vec3 vViewDir;

void main(void) {
    vec3 sunPos = vec3(500, 4, 400);
    vec3 sunDir = normalize(_CamPos - sunPos);
    vec3 viewDir = normalize(vViewDir);
    vec3 sunCol = vec3(0.36, 0.13, 0.26);

    float sun = dot(viewDir, sunDir);       // not really a "sun" anymore.. just a splash of colour in the direction of the sun

    sun = smoothstep(0.56, 1.0, sun) * 0.09;
    sunCol *= sun;

    vec3 gradient = mix(_Colour1, _Colour2, vUV.y);

    vec3 col = gradient + sunCol;

    gl_FragColor = vec4(col, 1.0);
}