precision highp float;

// Varyings (received from vertex shader)
varying vec3 vPosition;
varying vec4 vClipSpace;
varying vec2 vUV;

// Uniforms
uniform sampler2D depthTex;
uniform sampler2D refractionSampler;
uniform sampler2D normalMap1;
uniform sampler2D normalMap2;

uniform float camMinZ;
uniform float camMaxZ;
uniform float maxDepth;
uniform vec4 wDeepColor;
uniform vec4 wShallowColor;
uniform float time;
uniform vec2 waterSpeed;

vec2 getNormalisedDeviceCoords()
{
    return (vClipSpace.xy / vClipSpace.w) / 2.0 + 0.5;
}

float getWaterDepth(vec2 ndc)
{
    // grab depth value (0 to 1) at ndc for object behind water
    float depthOfObjectBehindWater = texture2D(depthTex, ndc).r;
    
    // get depth of water plane
    float linearWaterDepth = (vClipSpace.z + camMinZ) / (camMaxZ + camMinZ);
    
    // calculate water depth scaled to camMaxZ since camMaxZ >> camMinZ
    float waterDepth = camMaxZ*(depthOfObjectBehindWater - linearWaterDepth);
    
    // get water depth as a ratio of maxDepth
    float wdepth = clamp((waterDepth/maxDepth), 0.0, 1.0);

    return wdepth;
}

float getFoam()
{
    // TODO

    // decide the amount of foam 
    // float foam = 1.0 - smoothstep(0.1, 0.2, wdepth);
    
    // make the foam effect using noise
    // float foamEffect = smoothstep( 0.1, 0.2, noise(vec3(0., time, 0.)+vPosition*fNoiseScale*0.3)*foam);
    // baseColor.rgba += vec4(foamEffect);
    return 0.0;
}

vec3 getNormal(vec2 uv)
{
    vec3 normal = texture2D(normalMap1, vec2(uv.x + time * waterSpeed.x, uv.y + time * waterSpeed.y)).xyz;
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
    baseColor = mix(wShallowColor, wDeepColor, wdepth);
    
    // mix colors with scene render
    vec4 refractiveColor = texture2D(refractionSampler, ndc);
    baseColor = mix(refractiveColor, baseColor, baseColor.a);

    float foam = getFoam();
    baseColor.rgba += vec4(foam);

    vec3 normal = getNormal(vUV);
    baseColor.rgb = normal;

    gl_FragColor = baseColor;
}