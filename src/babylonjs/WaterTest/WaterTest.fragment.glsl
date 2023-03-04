precision highp float;

uniform float _Time;
uniform float _Speed;
uniform sampler2D _NormalMap;
uniform vec3 _SunPosition;
uniform vec3 _CamPosition;

// Varying (vert to frag parameters)
varying vec2 vUV;
varying vec3 vPosition;
varying vec4 vWorldPosition;
varying vec4 vClipSpace;

float saturate(float val) {
    return clamp(val, 0.0, 1.0);
}

vec2 getNormalisedDeviceCoords() {
    return (vClipSpace.xy / vClipSpace.w) / 2.0 + 0.5;
}

// https://github.com/mrdoob/three.js/blob/dev/examples/jsm/objects/Water.js
vec3 getNormal( vec2 uv ) {
    float time = _Time;

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

// void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {
//     vec3 reflection = normalize( reflect( -_SunPosition, surfaceNormal ) );
//     float direction = max( 0.0, dot( eyeDirection, reflection ) );
//     specularColor += pow( direction, shiny ) * sunColo * spec;
//     diffuseColor += max( dot( _SunPosition, surfaceNormal ), 0.0 ) * sunColor * diffuse;
// }

void main(void) {
    vec2 ndc = getNormalisedDeviceCoords();

    vec3 normal = getNormal(vWorldPosition.xz);

    vec3 sunDir = normalize(_SunPosition);
    
    // Ambient
    float ambient = 0.1;

    // Diffuse
    float diffuse = saturate(dot(normal, sunDir));

    // Specular
    vec3 viewDir = normalize(_CamPosition.xyz - vWorldPosition.xyz);
    vec3 halfDir = normalize(sunDir + viewDir);

    // Dot
    float NdotL = saturate(dot(normal, sunDir));
    float NdotH = saturate(dot(normal, halfDir));

    float _Shininess = 10.0;
    float specular = pow(NdotH, _Shininess);

    vec4 colour = vec4(vec3(ambient + diffuse + specular), 1.0);
    gl_FragColor = colour;
}