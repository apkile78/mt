Game.createView = function () {
  const config = Game.config;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, config.MAX_PIXEL_RATIO));
  document.body.prepend(renderer.domElement);
  const uniforms = {
    forward: { value: new THREE.Vector3() },
    right: { value: new THREE.Vector3() },
    viewUp: { value: new THREE.Vector3() },
    radialUp: { value: new THREE.Vector3() },
    aspect: { value: 1 },
    halfViewTangent: { value: Math.tan(config.FIELD_OF_VIEW * Math.PI / 360) },
    radius: { value: config.EARTH_RADIUS },
    altitude: { value: 0 }
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: Game.earthShaders.vertex,
    fragmentShader: Game.earthShaders.fragment,
    depthTest: false,
    depthWrite: false,
    toneMapped: false
  });
  const scene = new THREE.Scene();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  scene.add(quad);
  const camera = new THREE.Camera();
  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.aspect.value = window.innerWidth / window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();
  function setVector(name, vector) {
    uniforms[name].value.set(vector.x, vector.y, vector.z);
  }
  function draw(state, frame) {
    setVector("forward", frame.forward);
    setVector("right", frame.right);
    setVector("viewUp", frame.viewUp);
    setVector("radialUp", frame.up);
    uniforms.altitude.value = Game.vector.length(state.position) - config.EARTH_RADIUS;
    renderer.render(scene, camera);
  }
  return { canvas: renderer.domElement, draw };
};
