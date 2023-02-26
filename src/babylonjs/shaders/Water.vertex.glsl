precision highp float;

// Attributes (per vertex)
attribute vec3 position;
attribute vec2 uv;

// Uniforms (global)
uniform mat4 worldViewProjection;
uniform float time;
uniform float frequency;
uniform float amplitude;

// Varying (shared between vert/frag)
varying vec3 vPosition;
varying vec4 vClipSpace;
varying vec2 vUV;

void main(void) {
    // float newY = sin(position.x + time * frequency) * amplitude;
    // vec3 newPosition = vec3(position.x, newY, position.z);

    vPosition = position;
    vClipSpace = worldViewProjection * vec4(position, 1.0);
    vUV = uv;

    //a Convert position to world space
    gl_Position = vClipSpace;
}