Game.createInterface = function (canvas) {
  const menu = document.getElementById("menu");
  const button = document.getElementById("start");
  const message = document.getElementById("message");
  const telemetry = document.getElementById("telemetry");
  function captureError() {
    message.textContent = "Mouse capture blocked. Try a standalone browser tab.";
  }
  button.disabled = false;
  button.textContent = "Enter";
  message.textContent = "E flies outward; Q flies inward. No gravity or noclip.";
  button.addEventListener("click", function () {
    try {
      const request = canvas.requestPointerLock();
      if (request && request.catch) request.catch(captureError);
    } catch (error) {
      captureError();
    }
  });
  document.addEventListener("pointerlockerror", captureError);
  document.addEventListener("pointerlockchange", function () {
    menu.classList.toggle("hidden", document.pointerLockElement === canvas);
    button.textContent = "Resume";
  });
  function formatDistance(meters) {
    if (Math.abs(meters) >= 1000) return (meters / 1000).toFixed(2) + " km";
    return meters.toFixed(2) + " m";
  }
  function sync(state) {
    const distance = Game.vector.length(state.position);
    const altitude = distance - Game.config.EARTH_RADIUS;
    const latitude = Math.asin(Math.max(-1, Math.min(1,
      state.position.y / distance))) * 180 / Math.PI;
    const longitude = Math.atan2(state.position.z, state.position.x) * 180 / Math.PI;
    telemetry.textContent = "Speed: " + formatDistance(state.speed) + "/s" +
      "\nAltitude: " + formatDistance(altitude) +
      "\nLatitude: " + latitude.toFixed(5) + "°" +
      "  Longitude: " + longitude.toFixed(5) + "°" +
      (state.contact ? "\nGround contact" : "");
  }
  return { sync };
};
