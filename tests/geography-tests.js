(function () {
  const output = document.getElementById("results");
  const lines = [];
  function check(name, condition) {
    lines.push((condition ? "PASS: " : "FAIL: ") + name);
    output.textContent = lines.join("\n");
    if (!condition) throw new Error(name);
  }
  const samples = [
    ["Africa", 20, 0, true],
    ["North America", -100, 40, true],
    ["South America", -60, -10, true],
    ["Europe", 20, 50, true],
    ["Asia", 100, 45, true],
    ["Australia", 135, -25, true],
    ["Greenland", -42, 72, true],
    ["Antarctica", 0, -85, true],
    ["Pacific", -140, 0, false],
    ["Atlantic", -30, 0, false],
    ["Indian Ocean", 80, -25, false],
    ["Starting location is ocean", 90, 0, false]
  ];
  const image = new Image();
  image.onload = function () {
    check("Embedded mask decodes", image.width === 512 && image.height === 256);
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    for (const [name, longitude, latitude, expectedLand] of samples) {
      // Match shader UVs and the texture's vertical image flip.
      const radians = Math.PI / 180;
      const normal = {
        x: Math.cos(latitude * radians) * Math.cos(longitude * radians),
        y: Math.sin(latitude * radians),
        z: Math.cos(latitude * radians) * Math.sin(longitude * radians)
      };
      const u = (Math.atan2(normal.z, normal.x) + Math.PI) / (2 * Math.PI);
      const v = (Math.asin(normal.y) + Math.PI / 2) / Math.PI;
      const x = Math.min(image.width - 1, Math.floor(u * image.width));
      const y = Math.min(image.height - 1, Math.floor((1 - v) * image.height));
      const land = context.getImageData(x, y, 1, 1).data[0] >= 128;
      check(name, land === expectedLand);
    }
  };
  image.onerror = function () {
    check("Embedded mask decodes", false);
  };
  image.src = Game.landMaskPng;
})();
