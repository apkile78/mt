// Keep shared settings in one namespace for local classic-script loading.
window.Game = window.Game || {};
Game.config = Object.freeze({
  EARTH_RADIUS: 6371000,
  COLLISION_CLEARANCE: 1,
  COLLISION_MARGIN: 0.001,
  START_ALTITUDE: 2,
  START_PITCH: -0.2,
  START_SPEED: 5,
  MIN_SPEED: 0.5,
  MAX_SPEED: 10000000,
  SPEED_FACTOR: 2,
  MOUSE_SENSITIVITY: 0.002,
  MAX_FRAME_SECONDS: 0.05,
  MILLISECONDS_PER_SECOND: 1000,
  FIELD_OF_VIEW: 70,
  MAX_PIXEL_RATIO: 2,
  EPSILON: 1e-12
});
