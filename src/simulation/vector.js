Game.vector = {
  add(a, b) {
    return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
  },
  subtract(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  },
  scale(a, amount) {
    return { x: a.x * amount, y: a.y * amount, z: a.z * amount };
  },
  dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  },
  cross(a, b) {
    return { x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x };
  },
  length(a) {
    return Math.hypot(a.x, a.y, a.z);
  },
  normalize(a) {
    const length = this.length(a);
    if (length < Game.config.EPSILON) throw new Error("Invalid direction");
    return this.scale(a, 1 / length);
  },
  rotate(a, axis, angle) {
    const cosine = Math.cos(angle);
    const parallel = this.scale(axis, this.dot(axis, a) * (1 - cosine));
    return this.add(this.add(this.scale(a, cosine), parallel),
      this.scale(this.cross(axis, a), Math.sin(angle)));
  }
};
