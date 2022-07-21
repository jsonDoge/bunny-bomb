const THREE = require('three');
const { gsap } = require('gsap');
const { blackMat, lightBrownMat } = require('./materials');

const Bomb = function () {
  this.settings = {
    isThrowInProgress: false,
  };
  this.mesh = new THREE.Group();

  const bodyGeom = new THREE.SphereGeometry(6, 10, 10);

  this.body = new THREE.Mesh(bodyGeom, blackMat);

  const bodyTop = new THREE.CylinderGeometry(2, 2, 2);
  this.bodyTop = new THREE.Mesh(bodyTop, blackMat);
  this.bodyTop.position.setY(6);

  const thread = new THREE.CylinderGeometry(0.75, 0.75, 2);
  this.thread = new THREE.Mesh(thread, lightBrownMat);
  this.thread.position.setY(8);

  this.mesh.add(this.body);
  this.mesh.add(this.bodyTop);
  this.mesh.add(this.thread);

  this.body.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  this.mesh.position.set(0, 50, 0);
  this.mesh.visible = false;
};

const getBombPath = (startX, endX) => [
  { y: 20, x: startX },
  { y: 100, x: startX },
  { y: 60, x: endX },
  { y: 0, x: endX },
];

Bomb.prototype.throw = function (startPosition, endPosition, cb = () => {}) {
  if (this.settings.throwInProgress) { return; }
  this.settings.throwInProgress = true;
  this.mesh.position.set(startPosition.x, startPosition.y + 20, startPosition.z);

  this.mesh.visible = true;
  gsap.to(this.mesh.position, {
    duration: 1,
    x: endPosition.x,
    z: endPosition.z,
    ease: 'slow(0.3, 0.1, false)',
    motionPath: { path: getBombPath(startPosition.x, endPosition.x), type: 'cubic' },
    onComplete: () => {
      this.settings.throwInProgress = false;
      this.mesh.visible = false;
      cb();
    },
  });
};

const createBomb = function (scene) {
  const bomb = new Bomb();
  scene.add(bomb.mesh);
  return bomb;
};

module.exports = { createBomb };
