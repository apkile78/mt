// Draw the sphere analytically: no giant low-detail mesh under the player.
Game.earthShaders = {
  vertex: `
    varying vec2 screenUv;
    void main() {
      screenUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  fragment: `
    precision highp float;
    varying vec2 screenUv;
    uniform vec3 forward;
    uniform vec3 right;
    uniform vec3 viewUp;
    uniform vec3 radialUp;
    uniform float aspect;
    uniform float halfViewTangent;
    uniform float radius;
    uniform float altitude;
    void main() {
      vec2 screen = screenUv * 2.0 - 1.0;
      vec3 ray = normalize(forward + halfViewTangent *
        (right * screen.x * aspect + viewUp * screen.y));
      float cameraRadius = radius + altitude;
      float b = cameraRadius * dot(ray, radialUp);
      float c = altitude * (2.0 * radius + altitude);
      float discriminant = b * b - c;
      vec3 color = vec3(0.025, 0.035, 0.05);
      if (b < 0.0 && discriminant >= 0.0) {
        // Stable near-surface intersection avoids subtracting huge distances.
        float distance = c / (-b + sqrt(discriminant));
        vec3 normal = normalize(radialUp * (cameraRadius / radius) +
          ray * (distance / radius));
        vec3 light = normalize(vec3(0.4, 0.7, 1.0));
        float illumination = 0.35 + 0.65 * max(dot(normal, light), 0.0);
        color = vec3(0.23, 0.31, 0.23) * illumination;
      }
      gl_FragColor = vec4(color, 1.0);
    }
  `
};
