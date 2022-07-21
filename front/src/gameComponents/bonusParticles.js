const THREE = require('three');
const { gsap } = require('gsap');
const { pinkMat, greenMat } = require('./materials');

const BonusParticles = function () {
  this.mesh = new THREE.Group();
  const bigParticleGeom = new THREE.BoxGeometry(10, 10, 10, 1);
  const smallParticleGeom = new THREE.BoxGeometry(5, 5, 5, 1);
  this.parts = [];
  for (let i = 0; i < 10; i += 1) {
    const partPink = new THREE.Mesh(bigParticleGeom, pinkMat);
    const partGreen = new THREE.Mesh(smallParticleGeom, greenMat);
    partGreen.scale.set(0.5, 0.5, 0.5);
    this.parts.push(partPink);
    this.parts.push(partGreen);
    this.mesh.add(partPink);
    this.mesh.add(partGreen);
  }
};

BonusParticles.prototype.explose = function () {
  const explosionSpeed = 0.5;
  for (let i = 0; i < this.parts.length; i += 1) {
    const tx = -50 + Math.random() * 100;
    const ty = -50 + Math.random() * 100;
    const tz = -50 + Math.random() * 100;
    const p = this.parts[i];
    p.position.set(0, 0, 0);
    p.scale.set(1, 1, 1);
    p.visible = true;
    const s = explosionSpeed + Math.random() * 0.5;
    gsap.to(p.position, {
      x: tx, y: ty, z: tz, ease: 'power4.easeOut', duration: s,
    });
    gsap.to(p.scale, {
      x: 0.01, y: 0.01, z: 0.01, ease: 'power4.easeOut', onComplete: removeParticle, onCompleteParams: [p], duration: s,
    });
  }
};

const removeParticle = (p) => {
  p.visible = false;
};
