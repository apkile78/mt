Game.createNavigation = function () {
  const config = Game.config;
  return {
    position: { x: 0, y: 0, z: config.EARTH_RADIUS + config.START_ALTITUDE },
    forward: { x: 0, y: Math.cos(config.START_PITCH),
      z: Math.sin(config.START_PITCH) },
    up: { x: 0, y: -Math.sin(config.START_PITCH),
      z: Math.cos(config.START_PITCH) },
    speed: config.START_SPEED,
    contact: false
  };
};
Game.stepNavigation = function (state, input, seconds) {
  const config = Game.config;
  const vector = Game.vector;
  Game.rotateOrientation(state, input.mouseX, input.mouseY);
  state.speed = Math.max(config.MIN_SPEED, Math.min(config.MAX_SPEED,
    state.speed * config.SPEED_FACTOR ** input.speedSteps));
  const frame = Game.getFrame(state);
  let direction = vector.add(vector.add(
    vector.scale(frame.forward, input.forward),
    vector.scale(frame.right, input.right)), vector.scale(frame.up, input.vertical));
  const length = vector.length(direction);
  state.contact = false;
  if (length < config.EPSILON) return;
  // Normalize combined axes so diagonal travel keeps the selected speed.
  direction = vector.scale(direction, 1 / Math.max(1, length));
  const movement = vector.scale(direction, state.speed * seconds);
  const result = Game.collideWithEarth(state.position, movement);
  state.position = result.position;
  state.contact = result.contact;
};
