precision highp float;

attribute vec3 position;    // vertices from the mesh

uniform mat4 worldViewProjection;   // Used to calculate position on screen (projection)
uniform mat4 world;                 // Used to convert local position to world position

uniform float _Time;

varying vec3 vWorldNormal;

float newPosY(vec3 pos) {
    return sin(_Time * 10.0 + position.x);
}

void main(void) {
    vec3 newPosition = position;
    newPosition.y = newPosY(newPosition);

    // Re-create normal (the direction at right-angles to our surface)
    // Create two positions to the right and in front of the current position
    vec3 posPlusRight = position + vec3(0.1, 0.0, 0.0);
    posPlusRight.y = newPosY(posPlusRight);

    vec3 posPlusForward = position + vec3(0.0, 0.1, 0.0);
    posPlusForward.y = newPosY(posPlusForward);

    // Now take the cross product of these new positions
    vec3 newNormal = cross(posPlusForward, posPlusRight);

    vWorldNormal = normalize(newNormal).xyz;

    gl_Position = worldViewProjection * vec4(newPosition, 1.0);
}