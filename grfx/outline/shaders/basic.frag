precision mediump float;

varying vec3 n;
varying vec3 forward;

void main(void) {
    if(dot( forward, n) < 0.25)
      gl_FragColor = vec4 (0.0, 0.0, 0.0, 1.0);
    else if(dot( forward, n) < 0.5)
      gl_FragColor = vec4 (0.25, 0.25, 0.25, 1.0);
    else if(dot( forward, n) < 0.75)
      gl_FragColor = vec4 (0.75, 0.75, 0.75, 1.0);
    else
      gl_FragColor = vec4 (1.0, 1.0, 1.0, 1.0);
}