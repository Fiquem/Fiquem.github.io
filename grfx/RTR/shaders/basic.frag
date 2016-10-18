precision mediump float;



varying mat4 VVV;

varying vec3 p;
varying vec3 n;
varying vec2 t;

void main(void) {
    vec3 l_a = vec3 (0.9, 0.9, 0.9);
    vec3 k_a = vec3 (0.3, 0.5, 0.5);
    vec4 i_a = vec4 (l_a * k_a, 1.0);

    vec3 renorm = normalize (n);

    vec3 l_d = vec3 (0.3, 0.3, 0.3);
    vec3 k_d = vec3 (0.9, 0.5, 0.7);
    vec3 light_dir = normalize ((VVV * vec4 (1.0,1.0,1.0,0.0))).xyz;
    vec4 i_d = vec4 (l_d * k_d * max (0.0, dot (light_dir, renorm)), 1.0);

    vec3 l_s = vec3 (1.0, 1.0, 1.0);
    vec3 k_s = vec3 (1.0, 1.0, 1.0);
    vec3 r = normalize (reflect (-light_dir, renorm));
    vec3 v = normalize (-p);
    float spec_exp = 100.0;
    vec4 i_s = vec4 (l_s * k_s * max (0.0, pow (dot (v, r), spec_exp)), 1.0);


    gl_FragColor = i_a + i_d;
}