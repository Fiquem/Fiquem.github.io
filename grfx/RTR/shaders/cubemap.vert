attribute vec3 vp;

uniform mat4 M, V, P;

varying vec3 texcoords;

void main () {
  texcoords = vp;
  vec3 vp_scaled = vp * 500.0;
  gl_Position = P * V * M * vec4 (vp_scaled, 1.0);
}
