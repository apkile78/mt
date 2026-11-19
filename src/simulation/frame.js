Game.getFrame = function (state) {
  const vector = Game.vector;
  const up = vector.normalize(state.position);
  const right = vector.normalize(vector.cross(state.heading, up));
  const forward = vector.add(vector.scale(state.heading, Math.cos(state.pitch)),
    vector.scale(up, Math.sin(state.pitch)));
  const viewUp = vector.normalize(vector.cross(right, forward));
  return { up, right, forward, viewUp };
};
Game.transportHeading = function (heading, oldUp, newUp) {
  const vector = Game.vector;
  const cross = vector.cross(oldUp, newUp);
  const sine = vector.length(cross);
  const cosine = Math.max(-1, Math.min(1, vector.dot(oldUp, newUp)));
  let transported = heading;
  if (sine > Game.config.EPSILON) {
    transported = vector.rotate(heading, vector.scale(cross, 1 / sine),
      Math.atan2(sine, cosine));
  }
  // Removing numerical drift also handles the antipodal tangent case.
  return vector.normalize(vector.subtract(transported,
    vector.scale(newUp, vector.dot(transported, newUp))));
};
