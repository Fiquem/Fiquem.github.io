attribute vec3 vp;
attribute vec2 vt;
attribute vec3 vn;

uniform mat4 M, V, P;

varying mat4 VVV;
varying vec3 p;
varying vec3 n;
varying vec2 t;

void main () {
    VVV = V;
    p = vec3 (V * M * vec4 (vp, 1.0));
    n = vec3 (V * M * vec4 (vn, 0.0));
    t = vt;
    vec4 pos = P * V * M * vec4 (vp, 1);
    gl_Position = pos;
}
