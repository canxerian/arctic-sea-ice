precision highp float;

attribute vec3 position;    // vertices from the mesh

uniform mat4 worldViewProjection;   // Used to calculate position on screen (projection)

void main(void) {
    gl_Position = worldViewProjection * vec4(position, 1.0);
}