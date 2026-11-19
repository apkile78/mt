(function () {
  const output = document.getElementById("results");
  const lines = [];
  const v = Game.vector;
  const config = Game.config;
  const radius = config.EARTH_RADIUS;
  const idle = { forward: 0, right: 0, vertical: 0,
    mouseX: 0, mouseY: 0, speedSteps: 0 };
  function check(name, condition) {
    lines.push((condition ? "PASS: " : "FAIL: ") + name);
    output.textContent = lines.join("\n");
    if (!condition) throw new Error(name);
  }
  function close(a, b) {
    return v.length(v.subtract(a, b)) < 1e-6;
  }
  const state = Game.createNavigation();
  const initial = { ...state.position };
  Game.stepNavigation(state, idle, 10);
  check("No gravity drift", close(state.position, initial));
  const loop = Game.createNavigation();
  const originalFacing = { ...loop.forward };
  Game.stepNavigation(loop, { ...idle, mouseY: -Math.PI / config.MOUSE_SENSITIVITY }, 0);
  check("Pitch can turn upside down", v.dot(loop.forward, originalFacing) < -0.999999);
  Game.stepNavigation(loop, { ...idle, mouseY: -Math.PI / config.MOUSE_SENSITIVITY }, 0);
  check("Full pitch loop returns to original facing", close(loop.forward, originalFacing));
  const turned = Game.createNavigation();
  Game.rotateOrientation(turned, 0, -500);
  const ownUp = { ...turned.up };
  Game.rotateOrientation(turned, 200, 0);
  check("Yaw uses character up", close(turned.up, ownUp));
  for (const [key, axis] of [["forward", "forward"], ["right", "right"],
    ["vertical", "viewUp"]]) {
    for (const sign of [-1, 1]) {
      const flight = Game.createNavigation();
      flight.position = { x: 0, y: 0, z: radius * 3 };
      Game.rotateOrientation(flight, 300, -400);
      const facing = { ...flight.forward };
      const up = { ...flight.up };
      const start = { ...flight.position };
      const expected = v.scale(Game.getFrame(flight)[axis], sign * flight.speed);
      Game.stepNavigation(flight, { ...idle, [key]: sign }, 1);
      check(key + " " + sign + " uses local axis", close(v.subtract(flight.position, start), expected));
      check(key + " " + sign + " preserves orientation", close(flight.forward, facing) && close(flight.up, up));
    }
  }
  const elsewhere = Game.createNavigation();
  elsewhere.position = { x: 0, y: radius + 2, z: 0 };
  Game.stepNavigation(elsewhere, idle, 1);
  check("Polar position does not change facing", close(elsewhere.forward, originalFacing));
  for (let index = 0; index < 5000; index++) Game.rotateOrientation(turned, 3, -2);
  const frame = Game.getFrame(turned);
  check("Repeated rotations preserve perpendicular axes", Math.abs(v.dot(frame.forward, frame.viewUp)) < 1e-9);
  check("Orientation remains unit length", Math.abs(v.length(turned.forward) - 1) < 1e-9);
  const through = Game.collideWithEarth({ x: 0, y: 0, z: radius + 10 },
    { x: 0, y: 0, z: -4 * radius });
  check("Fast travel cannot tunnel through Earth", through.contact && through.position.z > radius);
  const contact = Game.createNavigation();
  contact.forward = { x: 0, y: 0, z: -1 };
  contact.up = { x: 0, y: 1, z: 0 };
  Game.stepNavigation(contact, { ...idle, forward: 1 }, 1);
  check("Collision keeps facing unchanged", contact.contact && contact.forward.z === -1);
  const diagonal = Game.createNavigation();
  diagonal.position.z = radius * 3;
  const start = { ...diagonal.position };
  Game.stepNavigation(diagonal, { ...idle, forward: 1, right: 1, vertical: 1 }, 1);
  check("Combined movement is speed limited", Math.abs(v.length(v.subtract(diagonal.position, start)) - 5) < 1e-6);
  Game.stepNavigation(state, { ...idle, speedSteps: 1 }, 0);
  check("Speed can increase", state.speed === config.START_SPEED * config.SPEED_FACTOR);
  Game.stepNavigation(state, { ...idle, speedSteps: -1000 }, 0);
  check("Minimum speed enforced", state.speed === config.MIN_SPEED);
  Game.stepNavigation(state, { ...idle, speedSteps: 1000 }, 0);
  check("Maximum speed enforced", state.speed === config.MAX_SPEED);
})();
