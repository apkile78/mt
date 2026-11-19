// Earth geometry and land colors are visual only; collision stays in simulation.
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
    uniform sampler2D landMask;
    const float PI = 3.141592653589793;
    vec3 surfaceColor(vec3 normal) {
      float longitude = atan(normal.z, normal.x);
      float latitude = asin(clamp(normal.y, -1.0, 1.0));
      vec2 mapUv = vec2((longitude + PI) / (2.0 * PI),
        (latitude + PI * 0.5) / PI);
      float land = step(0.5, texture2D(landMask, mapUv).r);
      return mix(vec3(0.045, 0.15, 0.29), vec3(0.23, 0.36, 0.21), land);
    }
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
        float distance = c / (-b + sqrt(discriminant));
        vec3 normal = normalize(radialUp * (cameraRadius / radius) +
          ray * (distance / radius));
        vec3 light = normalize(vec3(0.4, 0.7, 1.0));
        float illumination = 0.35 + 0.65 * max(dot(normal, light), 0.0);
        color = surfaceColor(normal) * illumination;
      }
      gl_FragColor = vec4(color, 1.0);
    }
  `
};
