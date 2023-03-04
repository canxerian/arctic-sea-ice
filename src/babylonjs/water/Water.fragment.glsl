precision highp float;

uniform sampler2D _NormalMap;
uniform sampler2D _DepthTex;

uniform float _Time;
uniform float _WaterNormalMapSpeed;
uniform float _WaterNormalMapSize;
uniform vec3 _SunPosition;
uniform vec3 _CamPosition;
uniform float _Shininess;
uniform float _WaterMaxDepth;
uniform vec3 _WaterColourDeep;
uniform vec3 _WaterColourShallow;
uniform vec2 _CamNearFar;

// Varying (vert to frag parameters)
varying vec2 vUV;
varying vec3 vPosition;
varying vec4 vWorldPosition;
varying vec4 vClipSpace;

float saturate(float val) {
    return clamp(val, 0.0, 1.0);
}

float getWaterDepth() {
    float camNear = _CamNearFar[0];
    float camFar = _CamNearFar[1];

    // Normalised device coords (i.e the fragment, in screen-space)
    vec2 ndc = (vClipSpace.xy / vClipSpace.w) / 2.0 + 0.5;
    
    // grab depth value (0 to 1) at ndc for object behind water
    float depthOfObjectBehindWater = texture2D(_DepthTex, ndc).r;
    
    // get depth of water plane
    float linearWaterDepth = (vClipSpace.z + camNear) / (camFar + camNear);
    
    // calculate water depth scaled to camFar since camFar > camNear
    float waterDepth = camFar * (depthOfObjectBehindWater - linearWaterDepth);
    
    // get water depth as a ratio of _WaterMaxDepth
    float wdepth = clamp((waterDepth / _WaterMaxDepth), 0.0, 1.0);

    return wdepth;
}

// https://github.com/mrdoob/three.js/blob/dev/examples/jsm/objects/Water.js
vec3 getNormal( vec2 uv ) {
    float time = _Time * _WaterNormalMapSpeed;
    uv *= _WaterNormalMapSize;
    
    vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
    vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
    vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
    vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
    vec3 noise = texture2D( _NormalMap, uv0 ).xyz +
        texture2D( _NormalMap, uv1 ).xyz +
        texture2D( _NormalMap, uv2 ).xyz +
        texture2D( _NormalMap, uv3 ).xyz;
    
    return normalize(noise * 0.5 - 1.0);
}

void main(void) {
    vec3 normal = getNormal(vWorldPosition.xz).xzy;

    vec3 sunDir = normalize(_SunPosition);
    
    // Water Colour
    vec3 waterColour = mix(_WaterColourShallow, _WaterColourDeep, getWaterDepth());

    // Ambient
    float ambient = 0.1;

    // Diffuse
    float diffuse = saturate(dot(normal, sunDir));

    // Specular (Blinn-Phong)
    vec3 viewDir = normalize(_CamPosition.xyz - vWorldPosition.xyz);
    vec3 halfDir = normalize(sunDir + viewDir);
    float NdotL = saturate(dot(normal, sunDir));
    float NdotH = saturate(dot(normal, halfDir));
    float specular = pow(NdotH, _Shininess);

    vec4 outColour = vec4(vec3(ambient + diffuse + specular), 1.0);
    outColour.rgb += waterColour;
    
    gl_FragColor = outColour;
}