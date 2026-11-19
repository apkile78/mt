Game.getFrame = function (state) {
  const vector = Game.vector;
  const forward = vector.normalize(state.forward);
  const right = vector.normalize(vector.cross(forward, state.up));
  const viewUp = vector.normalize(vector.cross(right, forward));
  return { forward, right, up: state.up, viewUp };
};
Game.rotateOrientation = function (state, mouseX, mouseY) {
  const vector = Game.vector;
  let frame = Game.getFrame(state);
  // Yaw turns around the character's own up; pitch uses its own right axis.
  let forward = vector.rotate(frame.forward, frame.up,
    -mouseX * Game.config.MOUSE_SENSITIVITY);
  frame = Game.getFrame({ ...state, forward });
  forward = vector.rotate(frame.forward, frame.right,
    -mouseY * Game.config.MOUSE_SENSITIVITY);
  state.forward = vector.normalize(forward);
  state.up = vector.normalize(vector.cross(frame.right, state.forward));
};
