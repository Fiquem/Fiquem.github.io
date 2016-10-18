attribute vec3 vp;
attribute vec2 vt;
attribute vec3 vn;

uniform mat4 M, V, P;

varying vec3 n;
varying vec3 forward;

void main () {
    n = vec3 (V * M * vec4 (vn, 0.0));
    forward = vec3 (V[2][0], V[2][1], V[2][2]);
    vec4 pos = P * V * M * vec4 (vp, 1);
    gl_Position = pos;
}
