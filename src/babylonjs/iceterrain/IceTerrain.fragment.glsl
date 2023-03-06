precision highp float;

varying vec3 vWorldNormal;
varying vec3 vTangent;

void main(void) {
    vec3 lightPos = normalize(vec3(5, 10, 2));         // Made up light position
    float diffuse = dot(normalize(vWorldNormal), lightPos);
    gl_FragColor = vec4(vec3(diffuse), 1.0);               // Just return the colour white for every fragment
}