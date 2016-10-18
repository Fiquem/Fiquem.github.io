precision mediump float;

varying vec3 pos_eye;
varying vec3 n_eye;
varying float fresnel_ratio;

uniform samplerCube cube_texture;
uniform mat4 inv_V;

void main()
{
  vec3 incident_eye = normalize (pos_eye);
  vec3 normal = normalize (n_eye);

  vec3 reflected = reflect (incident_eye, normal);

  reflected = vec3 (inv_V * vec4 (reflected, 0.0));

  float ratio = 1.0 /1.3333;
  vec3 refracted = refract (incident_eye, normal, ratio);
  refracted = vec3 (inv_V * vec4 (refracted, 0.0));

  vec4 color = mix(textureCube (cube_texture, refracted), textureCube (cube_texture, reflected), fresnel_ratio);
  vec4 color_refl = textureCube (cube_texture, reflected);
  vec4 color_refr = textureCube (cube_texture, refracted);

  gl_FragColor = vec4 (color.xyz, 1.0);
}