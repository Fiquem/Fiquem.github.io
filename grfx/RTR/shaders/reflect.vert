attribute vec3 vp;
attribute vec2 vt;
attribute vec3 vn;

const float Eta = 0.66;
const float FresnelPower = 10.0; 
const float F  = ((1.0-Eta) * (1.0-Eta)) / ((1.0+Eta) * (1.0+Eta)); 

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;

varying vec3 pos_eye;
varying vec3 n_eye;
 
varying float fresnel_ratio; 

void main()
{
  pos_eye = vec3 (M * vec4 (vp, 1.0));
  n_eye = vec3 (M * vec4 (vn, 0.0));
  fresnel_ratio = normalize (F + (1.0 - F) * pow((1.0 - dot(-normalize(pos_eye), normalize(n_eye))), FresnelPower));
  pos_eye = vec3 (V * M * vec4 (vp, 1.0));
  n_eye = vec3 (V * M * vec4 (vn, 0.0));
  gl_Position = P * V * M * vec4(vp, 1.0);
}