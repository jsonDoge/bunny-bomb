const THREE = require('three');

// Materials
const blackMat = new THREE.MeshPhongMaterial({
  color: 0x100707,
  flatShading: THREE.FlatShading,
});

const brownMat = new THREE.MeshPhongMaterial({
  color: 0xb44b39,
  shininess: 0,
  flatShading: THREE.FlatShading,
});

const greenMat = new THREE.MeshPhongMaterial({
  color: 0x7abf8e,
  shininess: 0,
  flatShading: THREE.FlatShading,
});

const pinkMat = new THREE.MeshPhongMaterial({
  color: 0xdc5f45, // 0xb43b29,//0xff5b49,
  shininess: 0,
  flatShading: THREE.FlatShading,
});

const lightBrownMat = new THREE.MeshPhongMaterial({
  color: 0xe07a57,
  flatShading: THREE.FlatShading,
});

const whiteMat = new THREE.MeshPhongMaterial({
  color: 0xa49789,
  flatShading: THREE.FlatShading,
});

const skinMat = new THREE.MeshPhongMaterial({
  color: 0xff9ea5,
  flatShading: THREE.FlatShading,
});

const floorShadow = new THREE.MeshPhongMaterial({
  color: 0x7abf8e,
  specular: 0x000000,
  shininess: 1,
  transparent: true,
  opacity: 0.5,
});

const grassMat = new THREE.MeshPhongMaterial({
  color: 0x3B894A,
  transparent: true,

  shininess: 0,
});

const redMat = new THREE.MeshLambertMaterial({
  color: 0x894a3b,
  transparent: true,

  shininess: 0,
});

module.exports = {
  blackMat,
  brownMat,
  greenMat,
  pinkMat,
  lightBrownMat,
  whiteMat,
  skinMat,
  floorShadow,
  grassMat,
  redMat,
};
