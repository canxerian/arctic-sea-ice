precision highp float;

varying vec3 vWorldNormal;
varying vec2 vUV;
varying vec3 vColour;

uniform sampler2D _IceExtentImg;
uniform float _CamZoomNormalised;
uniform vec4 _IceImageCrop;

void main(void) {
    if (length(vColour) < 0.1 && _CamZoomNormalised < 0.998) {
        discard;
    }

    vec2 uv = vUV;

    float camZoom = smoothstep(1.0, 0.96, _CamZoomNormalised);
    vec3 albedo = texture2D(_IceExtentImg, uv).rgb;
    vec4 outCol = vec4(mix(albedo, vColour, camZoom), 1.0);
    
    gl_FragColor = outCol;
}