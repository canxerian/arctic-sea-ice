precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 world;
uniform mat4 worldViewProjection;
uniform vec3 _CamPos;

varying vec2 vUV;
varying vec3 vViewDir;

void main(void) {
    gl_Position = worldViewProjection * vec4(position, 1.0);
    vUV = uv;

    vec3 worldPos = (world * vec4(position, 1.0)).xyz;
    vViewDir = _CamPos - worldPos;
}