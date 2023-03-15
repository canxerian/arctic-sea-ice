precision highp float;

varying vec3 vWorldNormal;
varying vec2 vUV;
varying vec3 vColour;

uniform sampler2D _IceExtentImg;
uniform vec3 _SunPosition;
uniform float _CamZoomNormalised;

void main(void) {
    // if (length(vColour) < 0.1) {
    //     discard;
    // }

    // float diffuse = clamp(dot(normalize(vWorldNormal), normalize(_SunPosition)), 0.0, 1.0);

    float camZoom = smoothstep(1.0, 0.96, _CamZoomNormalised);
    vec3 albedo = texture2D(_IceExtentImg, vUV).rgb;
    vec4 outCol = vec4(mix(albedo, vColour, camZoom), 1.0);
    
    gl_FragColor = outCol;
    // gl_FragColor = vec4(vec3(diffuse), 1.0);

    // gl_FragColor = vec4(vec3(vColour), 1.0);
}