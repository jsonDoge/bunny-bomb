const THREE = require('three');
const { gsap, MotionPathPlugin, SlowMo } = require('gsap/all');
const { cloneDeep } = require('lodash');

gsap.registerPlugin(MotionPathPlugin, SlowMo);

// helpers
const { createMouseDownHandler } = require('./gameHelpers/clickHandler');

// components
const { createBunny } = require('./gameComponents/bunny');
const { createBomb } = require('./gameComponents/bomb');
const { createBear } = require('./gameComponents/bear');
const { createGrid } = require('./gameComponents/grid');
const {
  floorShadow: floorShadowMaterial,
} = require('./gameComponents/materials');

const { initUI } = require('./ui');
const { convertVectorToIndex, convertIndexToVector } = require('./gameHelpers/utils');
const {
  preload: preloadTree,
  createTree,
  generateTreeStartPosition,
} = require('./gameComponents/tree');

let scene;
let camera; let fieldOfView; let aspectRatio; let nearPlane; let farPlane;
let shadowLight;
let renderer;
let container;
let clock;
let delta = 0;
const floorRadius = 17280;
let distance = 0;

const initSpeed = 24;
const maxSpeed = 48;

const speed = {
  current: initSpeed,
};

const initialBearPos = { x: -189, y: 15, z: 0 };
const initialBearGridPos = { x: -180, y: 0, z: 0 };

const initialBunnyPos = { x: 0, y: 0, z: 0 };
const initialBunnyGridPos = { x: 0, y: 0, z: 0 };

const floorRotationSpeedFactor = 200 / floorRadius * 0.03;

let floorRotation = 0;

// CAMERA

const cameraPosXGame = -32;
const cameraPosZGame = 320;
const cameraPosYGame = 120;

const malusClear = {
  color: 0xb44b39,
  alpha: 0,
};

// GAME SETTINGS
let playerRunner;
const TREE_COUNT = 30;
const TREE_FLOOR_ANGLE_COVERAGE = 0.08;

// PLAYER ACTIONS
const currentActions = {};
let playerActionsSubscription = () => { };
let isActionsAllowed = false;

// SCREEN & MOUSE VARIABLES
let HEIGHT; let
  WIDTH;
// 3D OBJECTS VARIABLES

let floor;

let bunny;
let bunnyGrid;
let bunnyThrowBomb;

let bear;
let bearGrid;
let bearThrowBomb;

const trees = [];

// INIT THREE JS, SCREEN AND MOUSE EVENTS

const initScreenAnd3D = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();

  scene.fog = new THREE.Fog(0xD6EACD, 300, 650);

  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 50;
  nearPlane = 1;
  farPlane = 100000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane,
  );

  camera.position.z = cameraPosZGame;
  camera.position.y = cameraPosYGame;
  camera.position.x = cameraPosXGame;

  camera.lookAt(new THREE.Vector3(-32, 30, 0));
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(malusClear.color, malusClear.alpha); // malusColorClear, malusClearAlpha

  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);

  clock = new THREE.Clock();
};

const createThrowBomb = (fromPosition) => {
  const bomb = createBomb(scene);

  return (targetPosition, cb) => bomb.throw(fromPosition, targetPosition, cb);
};

const handleWindowResize = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
};

const createLights = () => {
  const globalLight = new THREE.AmbientLight(0xf8ecd2, 0.9);

  shadowLight = new THREE.DirectionalLight(0xffffff, 1);
  shadowLight.position.set(64, 640, -640);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -600;
  shadowLight.shadow.camera.right = 600;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 2000;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  scene.add(globalLight);
  scene.add(shadowLight);
};

// eslint-disable-next-line no-shadow
const createTrees = (scene) => {
  const treeInterval = TREE_FLOOR_ANGLE_COVERAGE / TREE_COUNT;

  for (let i = 0; i < TREE_COUNT; i += 1) {
    const tree = createTree(scene, true);

    const zDeviation = treeInterval * i + Math.random() * (
      TREE_FLOOR_ANGLE_COVERAGE / (TREE_COUNT + 1)
    );
    const newPosition = generateTreeStartPosition(floor.rotation.z, floorRadius, zDeviation);
    tree.position.set(newPosition.x, newPosition.y, newPosition.z);

    const vec = tree.position.clone();
    const axis = new THREE.Vector3(0, 0, 1);
    tree.quaternion.setFromUnitVectors(axis, vec.clone().normalize());

    tree.startRotationZ = floor.rotation.z - zDeviation;
    floor.add(tree);
    trees.push(tree);
  }
};

const createFloor = () => {
  const floorShadow = new THREE.Mesh(
    new THREE.SphereGeometry(floorRadius, 200, 200),
    floorShadowMaterial,
  );
  // floorShadow.rotation.x = -Math.PI / 2;
  floorShadow.receiveShadow = true;

  const floorGrass = new THREE.Mesh(
    new THREE.SphereGeometry(floorRadius - 0.5, 200, 200),
    new THREE.MeshBasicMaterial({ color: 0x7abf8e }),
  );
  // floor.rotation.x = -Math.PI / 2;
  floorGrass.receiveShadow = false;

  floor = new THREE.Group();
  floor.position.y = -floorRadius;

  floor.add(floorShadow);
  floor.add(floorGrass);
  scene.add(floor);
};

const updateForestPositions = () => {
  // TODO: fix when screen hidden
  // const t = trees[trees.length - 1];
  trees.forEach((t) => {
    if ((floor.rotation.z - t.startRotationZ) > TREE_FLOOR_ANGLE_COVERAGE) {
      const zDeviation = (floor.rotation.z - t.startRotationZ) % TREE_FLOOR_ANGLE_COVERAGE;

      const newPosition = generateTreeStartPosition(floor.rotation.z, floorRadius, zDeviation);
      t.position.set(newPosition.x, newPosition.y, newPosition.z);
      // eslint-disable-next-line no-param-reassign
      t.startRotationZ = floor.rotation.z - zDeviation;

      const vec = t.position.clone();
      const axis = new THREE.Vector3(0, 0, 1);
      t.quaternion.setFromUnitVectors(axis, vec.clone().normalize());
      // trees.pop();
      // trees = [t, ...trees];
    }
  });
};

const updateFloorRotation = () => {
  floorRotation += delta * floorRotationSpeedFactor * speed.current;
  floorRotation %= (Math.PI * 2);
  floor.rotation.z = floorRotation;
};

const setRunnerDistance = (newDistance) => {
  gsap.to(
    bunnyGrid.grid.position,
    {
      duration: 2,
      x: initialBunnyGridPos.x + (newDistance * 25),
      ease: 'power1.easeOut',
    },
  );

  gsap.to(
    bunny.mesh.position,
    {
      duration: 2,
      x: bunny.mesh.position.x + ((newDistance - distance) * 25),
      ease: 'power1.easeOut',
    },
  );

  distance = newDistance;
};

const loop = () => {
  delta = clock.getDelta();
  updateFloorRotation();
  updateForestPositions();

  bunny.run(speed.current, maxSpeed, delta);
  bear.run(speed.current, maxSpeed, delta);

  render();
  requestAnimationFrame(loop);
};

const render = () => {
  renderer.render(scene, camera);
};

// player = 'bunny'|'bear'
const availableRunner = ['bunny', 'bear'];

const init = (runner) => {
  if (!availableRunner.includes(runner)) {
    throw new Error('Invalid runner choosen');
  }
  playerRunner = runner;

  initScreenAnd3D(runner);
  createLights();
  createFloor();
  createTrees(scene);
  bunny = createBunny(scene, initialBunnyPos);
  bunnyGrid = createGrid(scene, { x: 0, y: 0, z: 0 }, playerRunner === 'bunny');

  bear = createBear(scene, initialBearPos);
  bearGrid = createGrid(scene, { x: -180, y: 0, z: 0 }, playerRunner === 'bear');

  let playerGrid;
  let opponentGrid;

  if (playerRunner === 'bunny') {
    playerGrid = bunnyGrid.grid.children;
    opponentGrid = bearGrid.grid.children;
    bunnyThrowBomb = createThrowBomb(bunny.mesh.position);
    bearThrowBomb = createThrowBomb(bear.mesh.position);
  } else {
    playerGrid = bearGrid.grid.children;
    opponentGrid = bunnyGrid.grid.children;
    bearThrowBomb = createThrowBomb(bear.mesh.position);
    bunnyThrowBomb = createThrowBomb(bunny.mesh.position);
  }

  createMouseDownHandler(
    renderer,
    camera,
    playerGrid,
    opponentGrid,
    getIsActionsOpen,
    submitActionFactory(playerRunner),
  );

  initUI();
  resetGame();
  loop();
};

const submitActionFactory = (runner) => (action, target) => {
  const baseGridPosOpponent = runner === 'bunny' ? initialBearGridPos : bunnyGrid.grid.position;
  const baseGridPosPlayer = runner === 'bunny' ? bunnyGrid.grid.position : initialBearGridPos;

  if (action === 'moveTo') {
    const coords = convertVectorToIndex(target, baseGridPosPlayer, 50);
    console.debug(`moveTo ${JSON.stringify(coords)}`);

    currentActions.moveTo = coords;
  } else if (action === 'throwTo') {
    const coords = convertVectorToIndex(target, baseGridPosOpponent, 50);
    console.debug(`throwTo ${JSON.stringify(coords)}`);
    currentActions.throwTo = coords;
  }

  if (Object.keys(currentActions).length === 2) {
    playerActionsSubscription(cloneDeep(currentActions));
    delete currentActions.throwTo;
    delete currentActions.moveTo;
    isActionsAllowed = false;
  }
};

const subscribeToPlayerActions = (cb) => {
  playerActionsSubscription = cb;
};

const getIsActionsOpen = () => isActionsAllowed;

const openActionSelection = () => {
  isActionsAllowed = true;

  bunnyGrid.grid.children.forEach((c) => c.unClick());
  bearGrid.grid.children.forEach((c) => c.unClick());
};

const showActionResult = (bearMoveTo, bunnyMoveTo, bearThrowTo, bunnyThrowTo, cb) => {
  const bearMoveToVector = convertIndexToVector(bearMoveTo, initialBearPos, 50);
  const bunnyMoveToVector = convertIndexToVector(bunnyMoveTo, bunnyGrid.grid.position, 50);

  const bearThrowToVector = convertIndexToVector(bearThrowTo, bunnyGrid.grid.position, 50);
  const bunnyThrowToVector = convertIndexToVector(bunnyThrowTo, initialBearGridPos, 50);

  bear.moveToPosition(bearMoveToVector.x, bearMoveToVector.z);
  bunny.moveToPosition(bunnyMoveToVector.x, bunnyMoveToVector.z, () => {
    bearThrowBomb(bearThrowToVector);
    bunnyThrowBomb(bunnyThrowToVector, cb);
  });
};

const resetGame = () => {
  setRunnerDistance(0);
};

const preloadModels = async () => {
  console.info('Preloading models');
  await preloadTree();
};

/// /////////////////////////////////////////////
//                                        MODELS
/// /////////////////////////////////////////////

// TREE

module.exports = {
  init,
  preloadModels,
  resetGame,
  subscribeToPlayerActions,
  showActionResult,
  openActionSelection,
  setRunnerDistance,
};
