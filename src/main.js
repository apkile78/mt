(function () {
  const button = document.getElementById("start");
  const message = document.getElementById("message");
  if (!window.THREE) {
    button.textContent = "Three.js missing";
    message.textContent = "Keep your local r158 library at lib/three.js.";
    return;
  }
  try {
    const state = Game.createNavigation();
    const view = Game.createView();
    const controls = Game.createControls(view.canvas);
    const interfaceView = Game.createInterface(view.canvas);
    let previous = performance.now();
    function frame(now) {
      const seconds = Math.min((now - previous) /
        Game.config.MILLISECONDS_PER_SECOND, Game.config.MAX_FRAME_SECONDS);
      previous = now;
      if (controls.active()) Game.stepNavigation(state, controls.read(), seconds);
      view.draw(state, Game.getFrame(state));
      interfaceView.sync(state);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  } catch (error) {
    console.error(error);
    button.disabled = true;
    button.textContent = "Unable to start";
    message.textContent = "Open the browser console for the error.";
  }
})();
