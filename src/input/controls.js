Game.createControls = function (canvas) {
  const keys = new Set();
  const capturedKeys = ["KeyW", "KeyA", "KeyS", "KeyD", "KeyE", "KeyQ",
    "BracketLeft", "BracketRight"];
  let mouseX = 0;
  let mouseY = 0;
  let speedSteps = 0;
  function active() {
    return document.pointerLockElement === canvas;
  }
  function clear() {
    keys.clear();
    mouseX = 0;
    mouseY = 0;
    speedSteps = 0;
  }
  document.addEventListener("keydown", function (event) {
    if (!active() || !capturedKeys.includes(event.code)) return;
    event.preventDefault();
    keys.add(event.code);
    if (event.code === "BracketRight") speedSteps++;
    if (event.code === "BracketLeft") speedSteps--;
  });
  document.addEventListener("keyup", function (event) {
    keys.delete(event.code);
  });
  document.addEventListener("mousemove", function (event) {
    if (!active()) return;
    mouseX += event.movementX;
    mouseY += event.movementY;
  });
  document.addEventListener("wheel", function (event) {
    if (!active()) return;
    event.preventDefault();
    speedSteps -= Math.sign(event.deltaY);
  }, { passive: false });
  document.addEventListener("pointerlockchange", clear);
  window.addEventListener("blur", function () {
    clear();
    if (active()) document.exitPointerLock();
  });
  function read() {
    const input = {
      forward: Number(keys.has("KeyW")) - Number(keys.has("KeyS")),
      right: Number(keys.has("KeyD")) - Number(keys.has("KeyA")),
      vertical: Number(keys.has("KeyE")) - Number(keys.has("KeyQ")),
      mouseX, mouseY, speedSteps
    };
    mouseX = 0;
    mouseY = 0;
    speedSteps = 0;
    return input;
  }
  return { active, read };
};
