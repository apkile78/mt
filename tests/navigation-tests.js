(function () {
  const lines = [];
  const output = document.getElementById("results");
  function check(name, condition) {
    lines.push((condition ? "PASS: " : "FAIL: ") + name);
    output.textContent = lines.join("\n");
    if (!condition) throw new Error(name);
  }
  const vector = Game.vector;
  const radius = Game.config.EARTH_RADIUS;
  const idle = { forward: 0, right: 0, vertical: 0,
    mouseX: 0, mouseY: 0, speedSteps: 0 };
  const state = Game.createNavigation();
  const initial = { ...state.position };
  Game.stepNavigation(state, idle, 10);
  check("No gravity drift", vector.length(vector.subtract(initial, state.position)) === 0);
  Game.stepNavigation(state, { ...idle, vertical: 1 }, 1);
  check("Outward movement", Math.abs(vector.length(state.position) - radius - 7) < 1e-6);
  Game.stepNavigation(state, { ...idle, speedSteps: 1 }, 0);
  check("Speed increases", state.speed === 10);
  Game.stepNavigation(state, { ...idle, speedSteps: -1 }, 0);
  check("Speed decreases", state.speed === 5);
  const through = Game.collideWithEarth({ x: 0, y: 0, z: radius + 10 },
    { x: 0, y: 0, z: -4 * radius });
  check("Sweep blocks tunneling through whole Earth", through.contact && through.position.z > radius);
  const near = Game.collideWithEarth({ x: 0, y: 0, z: radius + 1 },
    { x: 0, y: 0, z: -100 });
  check("Surface inward motion blocked", near.contact && near.position.z > radius);
  const escape = Game.collideWithEarth(near.position, { x: 0, y: 0, z: 5 });
  check("Can move outward after contact", !escape.contact);
  const sideways = Game.collideWithEarth(near.position, { x: 10, y: 0, z: 0 });
  check("Tangential movement remains possible", !sideways.contact);
  const travel = Game.createNavigation();
  travel.pitch = 0;
  Game.stepNavigation(travel, { ...idle, forward: 1, right: 1 }, 1);
  check("Diagonal speed capped", Math.abs(vector.length(
    vector.subtract(travel.position, initial)) - 5) < 1e-6);
  const northPole = { x: 0, y: 1, z: 0 };
  const transported = Game.transportHeading({ x: 0, y: 1, z: 0 },
    { x: 0, y: 0, z: 1 }, northPole);
  check("Heading remains tangent at pole", Math.abs(vector.dot(transported, northPole)) < 1e-9);
  for (let index = 0; index < 500; index++) {
    Game.stepNavigation(travel, { ...idle, forward: 1, mouseX: 1 }, 0.05);
  }
  const frame = Game.getFrame(travel);
  check("Camera basis stays perpendicular", Math.abs(
    vector.dot(frame.forward, frame.right)) < 1e-9);
  check("Player remains outside Earth", vector.length(travel.position) >= radius + 1);
  Game.stepNavigation(travel, { ...idle, speedSteps: 1000 }, 0);
  check("Maximum speed enforced", travel.speed === Game.config.MAX_SPEED);
  Game.stepNavigation(travel, { ...idle, speedSteps: -1000 }, 0);
  check("Minimum speed enforced", travel.speed === Game.config.MIN_SPEED);
})();
