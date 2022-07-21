const THREE = require('three');
const { FBXLoader } = require('three/examples/jsm/loaders/FBXLoader');

const loader = new FBXLoader();
let model;

const preload = async () => {
  console.info('Loading tree');
  return new Promise((resolve) => {
    loader.load('../models/tree.fbx', (loadedModel) => {
      model = loadedModel;
      return resolve(loadedModel);
    });
  });
};

const DEFAULT_SIZE = 23;
const RAND_RANGE = 0.3;

const createTree = function (scene, isRandSize = false) {
  const tree = new THREE.Mesh(
    model.children[0].geometry,
    model.children[0].material,
  );
  tree.castShadow = true;
  tree.rotation.x = -Math.PI / 2;
  if (isRandSize) {
    const widthDeviation = DEFAULT_SIZE * Math.random() * (RAND_RANGE * 2) - RAND_RANGE;
    const heightDeviation = DEFAULT_SIZE * Math.random() * (RAND_RANGE * 2) - RAND_RANGE;
    tree.scale.set(
      DEFAULT_SIZE + widthDeviation,
      DEFAULT_SIZE + widthDeviation,
      DEFAULT_SIZE + heightDeviation,
    );
  } else {
    tree.scale.set(DEFAULT_SIZE, DEFAULT_SIZE, DEFAULT_SIZE);
  }
  scene.add(tree);
  return tree;
};

// theta between Math.PI * 1/2 + [.005, .02] range
const generateTreeStartPosition = (floorZRotation, floorRadius, zDeviation = 0) => {
  const upperLimit = 0.02;
  const lowerLimit = 0.005;
  const randThetaDeviation = Math.random() * (upperLimit - lowerLimit) + lowerLimit;

  const phi = (Math.PI * 1 / 2) - 0.04 - floorZRotation + zDeviation;
  const theta = (Math.PI * 1 / 2) + randThetaDeviation;

  const newPosition = new THREE.Vector3();
  newPosition.x = Math.sin(theta) * Math.cos(phi) * floorRadius;
  newPosition.y = Math.sin(theta) * Math.sin(phi) * floorRadius;
  newPosition.z = Math.cos(theta) * floorRadius;
  return newPosition;
};

module.exports = {
  createTree,
  preload,
  generateTreeStartPosition,
};
