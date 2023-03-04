precision highp float;

// Attributes (per vertex)
attribute vec3 position;
attribute vec2 uv;

// Uniforms (global)
uniform mat4 worldViewProjection;
uniform mat4 world;

// Varying (vert to frag parameters)
varying vec2 vUV;
varying vec3 vPosition;
varying vec4 vWorldPosition;
varying vec4 vClipSpace;

void main(void) {
    vUV = uv;
    vPosition = position;
    vWorldPosition = world * vec4(position, 1.0);
    vClipSpace = worldViewProjection * vec4(position, 1.0);

    //a Convert position to world space
    gl_Position = vClipSpace;
}