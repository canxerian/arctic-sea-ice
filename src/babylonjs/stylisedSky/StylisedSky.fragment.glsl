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

    float sun = dot(viewDir, sunDir);

    sun = step(0.999, sun);

    vec3 gradient = mix(_Colour1, _Colour2, vUV.y);

    vec3 col = gradient + vec3(sun);

    gl_FragColor = vec4(col, 1.0);
}