precision highp float;

varying vec3 vWorldNormal;
varying vec2 vUV;

uniform vec3 _SunPosition;
uniform sampler2D _IceExtentImg;

void main(void) {
    float diffuse = clamp(0.0, 1.0, dot(normalize(vWorldNormal), normalize(_SunPosition)));

    vec4 albedo = texture2D(_IceExtentImg, vUV);
    // gl_FragColor = albedo;

    gl_FragColor = vec4(vec3(diffuse), 1.0) + albedo;
}