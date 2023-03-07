precision highp float;

attribute vec3 position;            // vertices from the mesh
attribute vec2 uv;

uniform mat4 worldViewProjection;   // Used to calculate position on screen (projection)
uniform mat4 world;                 // Used to convert local position to world position

uniform float _Time;
uniform sampler2D _IceExtentImg;
uniform float _DisplaceThreshold;
uniform float _DisplaceScale;

varying vec3 vWorldNormal;
varying vec2 vUV;

float displace(vec2 uv) {
    vec4 tex = texture2D(_IceExtentImg, uv);
    float displacement = (tex.r + tex.g + tex.b) / 3.0;
    displacement = smoothstep(_DisplaceThreshold, _DisplaceThreshold + 0.1, displacement);
    return displacement * _DisplaceScale;
}

void main(void) {
    vec3 newPosition = position;
    newPosition.y = displace(uv);

    vec3 tangent = position + vec3(0.01, 0.0, 0.0);
    vec3 bitangent = position + vec3(0.0, 0.0, -0.01);

    tangent.y = displace(tangent.xy);
    bitangent.y = displace(bitangent.xz);

    vec3 normal = normalize(cross(bitangent - newPosition, tangent - newPosition));
    vWorldNormal = normal;

    vUV = uv;

    gl_Position = worldViewProjection * vec4(newPosition, 1.0);
}