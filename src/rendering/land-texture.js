Game.createLandTexture = function () {
  const texture = new THREE.TextureLoader().load(Game.landMaskPng,
    undefined, undefined, function (error) {
      console.error("The embedded Earth land mask could not be decoded.", error);
    });
  // The asset is a binary mask, not color imagery: do not apply sRGB decoding.
  texture.colorSpace = THREE.NoColorSpace;
  texture.flipY = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  return texture;
};
