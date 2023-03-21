precision highp float;

attribute vec3 position;            // vertices from the mesh
attribute vec2 uv;

uniform mat4 worldViewProjection;   // Used to calculate position on screen (projection)
uniform mat4 world;                 // Used to convert local position to world position

uniform float _Time;
uniform sampler2D _IceExtentImg;
uniform sampler2D _HeightLUT;
uniform float _DisplaceThreshold;
uniform float _DisplaceScale;
uniform int _LutThreshold;
uniform float _CamZoomNormalised;
uniform float _FlattenedPosY;       // position.y value when cam is fully zoomed in

varying vec3 vWorldNormal;
varying vec2 vUV;
varying vec3 vColour;

const int lookupNumSteps = 18;
const float lookupInterval = 1.0 / float(lookupNumSteps);

void lookup(vec3 pixel, inout vec3 outColour, inout float height) {
    float offset = 0.01;

    vec3 nearestColour = vec3(0, 0, 0);
    float nearestDist = 0.1;
    for (int i = _LutThreshold; i < lookupNumSteps; i++) {
        vec3 currentCol = texture2D(_HeightLUT, vec2(lookupInterval * float(i) + 0.01, 0)).rgb;
        float dist = distance(pixel, currentCol);

        if (dist < nearestDist) {
            nearestColour = currentCol;
            nearestDist = dist;
            height = float(i) / float(lookupNumSteps);      // normalise
        }
    }

    outColour = nearestColour;
}

float displace(vec2 _uv) {
    vec4 tex = texture2D(_IceExtentImg, _uv);
    float displacement = (tex.r + tex.g + tex.b) / 3.0;
    displacement = smoothstep(_DisplaceThreshold, _DisplaceThreshold + 0.1, displacement);
    return displacement * _DisplaceScale;
}

void main(void) {
    vec3 newPosition = position;

    vec3 outColour;
    float height;
    lookup(texture2D(_IceExtentImg, uv).rgb, outColour, height);

    // float camZoom = smoothstep(0.0, 0.2, _CamZoomNormalised);
    float camZoom = smoothstep(1.0, 0.99, _CamZoomNormalised);

    newPosition.y = mix(_FlattenedPosY, newPosition.y + height * _DisplaceScale, camZoom);

    vUV = uv;
    vColour = outColour;

    gl_Position = worldViewProjection * vec4(newPosition, 1.0);
}