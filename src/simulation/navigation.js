Game.createNavigation = function () {
  const config = Game.config;
  return {
    position: { x: 0, y: 0, z: config.EARTH_RADIUS + config.START_ALTITUDE },
    heading: { x: 0, y: 1, z: 0 },
    pitch: config.START_PITCH,
    speed: config.START_SPEED,
    contact: false
  };
};
Game.stepNavigation = function (state, input, seconds) {
  const config = Game.config;
  const vector = Game.vector;
  const up = vector.normalize(state.position);
  state.heading = vector.normalize(vector.rotate(state.heading, up,
    -input.mouseX * config.MOUSE_SENSITIVITY));
  state.pitch = Math.max(-config.PITCH_LIMIT, Math.min(config.PITCH_LIMIT,
    state.pitch - input.mouseY * config.MOUSE_SENSITIVITY));
  state.speed = Math.max(config.MIN_SPEED, Math.min(config.MAX_SPEED,
    state.speed * config.SPEED_FACTOR ** input.speedSteps));
  const frame = Game.getFrame(state);
  let direction = vector.add(vector.add(
    vector.scale(frame.forward, input.forward),
    vector.scale(frame.right, input.right)), vector.scale(frame.up, input.vertical));
  const length = vector.length(direction);
  state.contact = false;
  if (length < config.EPSILON) return;
  // Clamp blended inputs so diagonals never exceed the selected travel speed.
  direction = vector.scale(direction, 1 / Math.max(1, length));
  const movement = vector.scale(direction, state.speed * seconds);
  const result = Game.collideWithEarth(state.position, movement);
  state.position = result.position;
  state.contact = result.contact;
  state.heading = Game.transportHeading(state.heading, up,
    vector.normalize(state.position));
};
