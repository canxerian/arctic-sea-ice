precision highp float;

// Varyings (received from vertex shader)
varying vec3 vPosition;
varying vec4 vClipSpace;
varying vec2 vUV;

// Uniforms
uniform sampler2D _DepthTex;
uniform sampler2D _RefractionTex;
uniform sampler2D _NormalMap1;

uniform float _CamMinZ;
uniform float _CamMaxZ;
uniform float _WaterMaxDepth;
uniform vec4 _WaterDeepColour;
uniform vec4 _WaterShallowColour;
uniform float _Time;
uniform vec2 _WaterSpeed;

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

vec3 getNormal(vec2 uv)
{
    vec3 normal = texture2D(_NormalMap1, vec2(uv.x + _Time * _WaterSpeed.x, uv.y + _Time * _WaterSpeed.y)).xyz;
    return normalize(normal);
}

void main(void) 
{
    // init baseColor
    vec4 baseColor = vec4(0.0);
    
    // remap frag screen space coords to ndc (-1 to +1)
    vec2 ndc = getNormalisedDeviceCoords();
    
    float wdepth = getWaterDepth(ndc);
    
    // mix water colors based on depth
    baseColor = mix(_WaterShallowColour, _WaterDeepColour, wdepth);
    
    // mix colors with scene render
    vec4 refractiveColor = texture2D(_RefractionTex, ndc);
    baseColor = mix(refractiveColor, baseColor, baseColor.a);

    vec3 normal = getNormal(vUV);
    
    // Diffuse
    



    // baseColor.a = 0.5;
    gl_FragColor = baseColor;
}