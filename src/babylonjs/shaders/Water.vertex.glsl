precision highp float;

// Attributes (per vertex)
attribute vec3 position;
attribute vec2 uv;

// Uniforms (global)
uniform mat4 worldViewProjection;
uniform mat4 world;

uniform float _Time;
uniform float _Frequency;
uniform float _Amplitude;

// Varying (shared between vert/frag)
varying vec3 vPosition;
varying vec4 vClipSpace;
varying vec4 vWorldPosition;
varying vec2 vUV;

void main(void) {
    // float newY = sin(position.x + _Time * _Frequency) * _Amplitude;
    // vec3 newPosition = vec3(position.x, newY, position.z);

    vPosition = position;
    vClipSpace = worldViewProjection * vec4(position, 1.0);
    vWorldPosition = world * vec4(position, 1.0);
    vUV = uv;

    //a Convert position to world space
    gl_Position = vClipSpace;
}