precision highp float;

varying vec3 vWorldNormal;
varying vec2 vUV;

uniform vec3 _SunPosition;
uniform sampler2D _IceExtentImg;
varying vec3 vColour;

void main(void) {
    // float diffuse = clamp(dot(normalize(vWorldNormal), normalize(_SunPosition)), 0.0, 1.0);

    vec4 albedo = texture2D(_IceExtentImg, vUV);
    // float grey = (albedo.r + albedo.g + albedo.b) / 3.0;

    gl_FragColor = albedo;
    // gl_FragColor = vec4(vec3(diffuse), 1.0);

    gl_FragColor = vec4(vec3(vColour), 1.0);
}