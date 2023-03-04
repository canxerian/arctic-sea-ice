precision highp float;

// Varyings (received from vertex shader)
varying vec3 vPosition;
varying vec4 vClipSpace;
varying vec4 vWorldPosition;
varying vec2 vUV;

// Uniforms
uniform sampler2D _DepthTex;
uniform sampler2D _RefractionTex;
uniform sampler2D _NormalMap1;

uniform float _CamMinZ;
uniform float _CamMaxZ;
uniform vec3 _CamPosition;

uniform float _WaterMaxDepth;
uniform vec4 _WaterDeepColour;
uniform vec4 _WaterShallowColour;
uniform float _WaterSpeed;
uniform float _WaterShininess;
uniform vec3 _SunDirection;
uniform float _NormalBumpScale;
uniform float _Time;

float saturate(float val)
{
    return clamp(val, 0.0, 1.0);
}

vec2 getNormalisedDeviceCoords()
{
    return (vClipSpace.xy / vClipSpace.w) / 2.0 + 0.5;
}

float getWaterDepth(vec2 ndc)
{
    // grab depth value (0 to 1) at ndc for object behind water
    float depthOfObjectBehindWater = texture2D(_DepthTex, ndc).r;
    
    // get depth of water plane
    float linearWaterDepth = (vClipSpace.z + _CamMinZ) / (_CamMaxZ + _CamMinZ);
    
    // calculate water depth scaled to _CamMaxZ since _CamMaxZ >> _CamMinZ
    float waterDepth = _CamMaxZ * (depthOfObjectBehindWater - linearWaterDepth);
    
    // get water depth as a ratio of _WaterMaxDepth
    float wdepth = clamp((waterDepth / _WaterMaxDepth), 0.0, 1.0);

    return wdepth;
}

vec3 getNoise(vec2 uv)
{
    // https://github.com/mrdoob/three.js/blob/7da79d5d95839781dcbc54d341d0d7bf6d6dae44/examples/jsm/objects/Water.js
    float time = _WaterSpeed * _Time;
    vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
    vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
    vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
    vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
    vec4 noise = texture2D( _NormalMap1, uv0 ) +
        texture2D( _NormalMap1, uv1 ) +
        texture2D( _NormalMap1, uv2 ) +
        texture2D( _NormalMap1, uv3 );
    return normalize(noise * 0.5 - 1.0).xyz;
}

void main(void) 
{
    vec4 baseColour = vec4(0.0);
    
    // remap frag screen space coords to ndc (-1 to +1)
    vec2 ndc = getNormalisedDeviceCoords();

    float wdepth = getWaterDepth(ndc);
        
    // // mix colors with scene render
    // vec4 refractiveColor = texture2D(_RefractionTex, ndc);
    // baseColour = mix(refractiveColor, baseColour, baseColour.a);

    vec3 normal = getNoise(vWorldPosition.xz);
    vec3 sunDir = normalize(_SunDirection);

    // Diffuse
    float diffuse = max(0.0, dot(normal, sunDir));

    // Specular
    // https://en.wikibooks.org/wiki/Cg_Programming/Unity/Specular_Highlights
    vec3 viewDir = normalize(_CamPosition.xyz - vWorldPosition.xyz);
    vec3 reflection = normalize(reflect(-sunDir, normal));
    float lightReceivedByEye = dot(viewDir, reflection);
    float specular = saturate(pow(lightReceivedByEye, _WaterShininess));

    // mix water colors based on depth
    baseColour = mix(_WaterShallowColour, _WaterDeepColour, wdepth);


    baseColour.xyz = baseColour.xyz + specular; 

    gl_FragColor = baseColour;
    // gl_FragColor = vec4(vec3(diffuse + specular), 1.0);
}