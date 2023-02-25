precision highp float;

// Varyings (received from vertex shader)
varying vec3 vPosition;
varying vec4 vClipSpace;
varying vec2 vUV;

// Uniforms
uniform sampler2D depthTex;
uniform sampler2D refractionSampler;
uniform float camMinZ;
uniform float camMaxZ;
uniform float maxDepth;

// water colors
uniform vec4 wDeepColor;
uniform vec4 wShallowColor;
uniform float time;
uniform float wNoiseScale;
uniform float wNoiseOffset;
uniform float fNoiseScale;

float mod289(float x) 
{ 
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) 
{ 
    return x - floor(x * (1.0 / 289.0)) * 289.0; 
}

vec4 perm(vec4 x) 
{ 
    return mod289(((x * 34.0) + 1.0) * x);
}

float noise(vec3 p) 
{
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

void main(void) 
{
    // init baseColor
    vec4 baseColor = vec4(0.0);

	// normalized device coordinates - remap frag screen space coords to ndc (-1 to +1)
    // We do this obtain our "UV" for the depth textur
    vec2 ndc = (vClipSpace.xy / vClipSpace.w) / 2.0 + 0.5;

	// grab depth value (0 to 1) at ndc for object behind water
	float depthOfObjectBehindWater = texture2D(depthTex, vec2(ndc.x, ndc.y)).r;
    
	// get depth of water plane
	float linearWaterDepth = (vClipSpace.z + camMinZ) / (camMaxZ + camMinZ);

    // calculate water depth scaled to camMaxZ since camMaxZ >> camMinZ
	float waterDepth = camMaxZ * (depthOfObjectBehindWater - linearWaterDepth);

    waterDepth = clamp(waterDepth / maxDepth, 0.0, 1.0);

    vec4 waterColour = mix(wDeepColor, wShallowColor, waterDepth);

    gl_FragColor = waterColour;
}