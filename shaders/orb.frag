// Reference fragment shader for a future full WebGL/GLSL orb upgrade.
// Current production hero uses a lightweight Canvas 2D fallback for broad iPhone support.
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  float d = length(uv);
  float sphere = smoothstep(0.42, 0.36, d);
  float rim = smoothstep(0.42, 0.395, d) - smoothstep(0.395, 0.36, d);
  vec3 base = vec3(0.015, 0.09, 0.14);
  vec3 ice = vec3(0.34, 0.78, 1.0);
  vec3 col = base * sphere + ice * rim * 0.7;
  col += ice * 0.14 * smoothstep(0.6, 0.1, length(uv - vec2(-0.12, 0.16)));
  gl_FragColor = vec4(col, sphere);
}