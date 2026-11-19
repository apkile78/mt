// Sweep the whole motion segment, not just its endpoint: no sphere tunneling.
Game.collideWithEarth = function (position, displacement) {
  const vector = Game.vector;
  const config = Game.config;
  const radius = config.EARTH_RADIUS + config.COLLISION_CLEARANCE;
  const a = vector.dot(displacement, displacement);
  const b = vector.dot(position, displacement);
  const distance = vector.length(position);
  // Factored form preserves precision when close to a very large sphere.
  const c = (distance - radius) * (distance + radius);
  if (a === 0) return { position: { ...position }, contact: false };
  const discriminant = b * b - a * c;
  if (b < 0 && discriminant >= 0) {
    const fraction = Math.max(0, c / (-b + Math.sqrt(discriminant)));
    if (fraction <= 1) {
      const contact = vector.add(position, vector.scale(displacement, fraction));
      return {
        position: vector.scale(vector.normalize(contact),
          radius + config.COLLISION_MARGIN),
        contact: true
      };
    }
  }
  const end = vector.add(position, displacement);
  if (vector.length(end) < radius) {
    return {
      position: vector.scale(vector.normalize(end), radius + config.COLLISION_MARGIN),
      contact: true
    };
  }
  return { position: end, contact: false };
};
