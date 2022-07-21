const THREE = require('three');
const { gsap } = require('gsap');
const {
  brownMat, whiteMat, pinkMat, lightBrownMat, blackMat,
} = require('./materials');
const { getVertices } = require('../gameHelpers/utils');

const Bunny = function () {
  this.status = 'running';
  this.runningCycle = 0;
  this.mesh = new THREE.Group();
  this.body = new THREE.Group();
  this.mesh.add(this.body);

  const torsoGeom = new THREE.BoxGeometry(7, 7, 10, 1);

  this.torso = new THREE.Mesh(torsoGeom, brownMat);
  this.torso.position.z = 0;
  this.torso.position.y = 7;
  this.torso.castShadow = true;
  this.body.add(this.torso);

  const pantsGeom = new THREE.BoxGeometry(9, 9, 5, 1);
  this.pants = new THREE.Mesh(pantsGeom, whiteMat);
  this.pants.position.z = -3;
  this.pants.position.y = 0;
  this.pants.castShadow = true;
  this.torso.add(this.pants);

  const tailGeom = new THREE.BoxGeometry(3, 3, 3, 1);
  tailGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -2));
  this.tail = new THREE.Mesh(tailGeom, lightBrownMat);
  this.tail.position.z = -4;
  this.tail.position.y = 5;
  this.tail.castShadow = true;
  this.torso.add(this.tail);

  this.torso.rotation.x = -Math.PI / 8;

  const headGeom = new THREE.BoxGeometry(10, 10, 13, 1);

  headGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 7.5));
  this.head = new THREE.Mesh(headGeom, brownMat);
  this.head.position.z = 2;
  this.head.position.y = 11;
  this.head.castShadow = true;
  this.body.add(this.head);

  const cheekGeom = new THREE.BoxGeometry(1, 4, 4, 1);
  this.cheekR = new THREE.Mesh(cheekGeom, pinkMat);
  this.cheekR.position.x = -5;
  this.cheekR.position.z = 7;
  this.cheekR.position.y = -2.5;
  this.cheekR.castShadow = true;
  this.head.add(this.cheekR);

  this.cheekL = this.cheekR.clone();
  this.cheekL.position.x = -this.cheekR.position.x;
  this.head.add(this.cheekL);

  const noseGeom = new THREE.BoxGeometry(6, 6, 3, 1);
  this.nose = new THREE.Mesh(noseGeom, lightBrownMat);
  this.nose.position.z = 13.5;
  this.nose.position.y = 2.6;
  this.nose.castShadow = true;
  this.head.add(this.nose);

  const mouthGeom = new THREE.BoxGeometry(4, 2, 4, 1);
  mouthGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 3));
  mouthGeom.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 12));
  this.mouth = new THREE.Mesh(mouthGeom, brownMat);
  this.mouth.position.z = 8;
  this.mouth.position.y = -4;
  this.mouth.castShadow = true;
  this.head.add(this.mouth);

  const pawFGeom = new THREE.BoxGeometry(3, 3, 3, 1);
  this.pawFR = new THREE.Mesh(pawFGeom, lightBrownMat);
  this.pawFR.position.x = -2;
  this.pawFR.position.z = 6;
  this.pawFR.position.y = 1.5;
  this.pawFR.castShadow = true;
  this.body.add(this.pawFR);

  this.pawFL = this.pawFR.clone();
  this.pawFL.position.x = -this.pawFR.position.x;
  this.pawFL.castShadow = true;
  this.body.add(this.pawFL);

  const pawBGeom = new THREE.BoxGeometry(3, 3, 6, 1);
  this.pawBL = new THREE.Mesh(pawBGeom, lightBrownMat);
  this.pawBL.position.y = 1.5;
  this.pawBL.position.z = 0;
  this.pawBL.position.x = 5;
  this.pawBL.castShadow = true;
  this.body.add(this.pawBL);

  this.pawBR = this.pawBL.clone();
  this.pawBR.position.x = -this.pawBL.position.x;
  this.pawBR.castShadow = true;
  this.body.add(this.pawBR);

  const earGeom = new THREE.BoxGeometry(7, 18, 2, 1);

  const vertices = getVertices(earGeom.attributes.position.array);

  vertices[6].x += 2;
  vertices[6].z += 0.5;

  vertices[7].x += 2;
  vertices[7].z -= 0.5;

  vertices[2].x -= 2;
  vertices[2].z -= 0.5;

  vertices[3].x -= 2;
  vertices[3].z += 0.5;
  earGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 9, 0));

  this.earL = new THREE.Mesh(earGeom, brownMat);
  this.earL.position.x = 2;
  this.earL.position.z = 2.5;
  this.earL.position.y = 5;
  this.earL.rotation.z = -Math.PI / 12;
  this.earL.castShadow = true;
  this.head.add(this.earL);

  this.earR = this.earL.clone();
  this.earR.position.x = -this.earL.position.x;
  this.earR.rotation.z = -this.earL.rotation.z;
  this.earR.castShadow = true;
  this.head.add(this.earR);

  const eyeGeom = new THREE.BoxGeometry(2, 4, 4);

  this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
  this.eyeL.position.x = 5;
  this.eyeL.position.z = 5.5;
  this.eyeL.position.y = 2.9;
  this.eyeL.castShadow = true;
  this.head.add(this.eyeL);

  const irisGeom = new THREE.BoxGeometry(0.6, 2, 2);

  this.iris = new THREE.Mesh(irisGeom, blackMat);
  this.iris.position.x = 1.2;
  this.iris.position.y = 1;
  this.iris.position.z = 1;
  this.eyeL.add(this.iris);

  this.eyeR = this.eyeL.clone();
  this.eyeR.children[0].position.x = -this.iris.position.x;

  this.eyeR.position.x = -this.eyeL.position.x;
  this.head.add(this.eyeR);

  this.body.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
};

Bunny.prototype.moveToPosition = function (x, z, cb = () => {}) {
  gsap.to(this.mesh.position, { duration: 2, x, ease: 'power4.easeInOut' });
  gsap.to(this.mesh.position, {
    duration: 2, z, ease: 'power4.easeInOut', onComplete: cb,
  });
};

Bunny.prototype.run = function (currentSpeed, maxSpeed, delta) {
  this.status = 'running';

  const s = Math.min(currentSpeed, maxSpeed);

  this.runningCycle += delta * s * 0.7;
  this.runningCycle %= (Math.PI * 2);
  const t = this.runningCycle;

  const amp = 4;
  const disp = 0.2;

  // BODY

  this.body.position.y = 6 + Math.sin(t - Math.PI / 2) * amp;
  this.body.rotation.x = 0.2 + Math.sin(t - Math.PI / 2) * amp * 0.1;

  this.torso.rotation.x = Math.sin(t - Math.PI / 2) * amp * 0.1;
  this.torso.position.y = 7 + Math.sin(t - Math.PI / 2) * amp * 0.5;

  // MOUTH
  this.mouth.rotation.x = Math.PI / 16 + Math.cos(t) * amp * 0.05;

  // HEAD
  this.head.position.z = 2 + Math.sin(t - Math.PI / 2) * amp * 0.5;
  this.head.position.y = 8 + Math.cos(t - Math.PI / 2) * amp * 0.7;
  this.head.rotation.x = -0.2 + Math.sin(t + Math.PI) * amp * 0.1;

  // EARS
  this.earL.rotation.x = Math.cos(Math.PI / 2 + t) * (amp * 0.2);
  this.earR.rotation.x = Math.cos(Math.PI / 2 + 0.2 + t) * (amp * 0.3);

  // EYES
  this.eyeR.scale.y = this.eyeL.scale.y = 0.7 + Math.abs(Math.cos(-Math.PI / 4 + t * 0.5)) * 0.6;

  // TAIL
  this.tail.rotation.x = Math.cos(Math.PI / 2 + t) * amp * 0.3;

  // FRONT RIGHT PAW
  this.pawFR.position.y = 1.5 + Math.sin(t) * amp;
  this.pawFR.rotation.x = Math.cos(t) * Math.PI / 4;

  this.pawFR.position.z = 6 - Math.cos(t) * amp * 2;

  // FRONT LEFT PAW

  this.pawFL.position.y = 1.5 + Math.sin(disp + t) * amp;
  this.pawFL.rotation.x = Math.cos(t) * Math.PI / 4;

  this.pawFL.position.z = 6 - Math.cos(disp + t) * amp * 2;

  // BACK RIGHT PAW
  this.pawBR.position.y = 1.5 + Math.sin(Math.PI + t) * amp;
  this.pawBR.rotation.x = Math.cos(t + Math.PI * 1.5) * Math.PI / 3;

  this.pawBR.position.z = -Math.cos(Math.PI + t) * amp;

  // BACK LEFT PAW
  this.pawBL.position.y = 1.5 + Math.sin(Math.PI + t) * amp;
  this.pawBL.rotation.x = Math.cos(t + Math.PI * 1.5) * Math.PI / 3;

  this.pawBL.position.z = -Math.cos(Math.PI + t) * amp;
};

Bunny.prototype.nod = function () {
  const _this = this;
  const sp = 0.5 + Math.random();

  // HEAD
  const tHeadRotY = -Math.PI / 6 + Math.random() * Math.PI / 3;
  gsap.to(this.head.rotation, {
    duration: sp, y: tHeadRotY, ease: 'power4.easeInOut', onComplete () { _this.nod(); },
  });

  // EARS
  const tEarLRotX = Math.PI / 4 + Math.random() * Math.PI / 6;
  const tEarRRotX = Math.PI / 4 + Math.random() * Math.PI / 6;

  gsap.to(this.earL.rotation, { duration: sp, x: tEarLRotX, ease: 'power4.easeInOut' });
  gsap.to(this.earR.rotation, { duration: sp, x: tEarRRotX, ease: 'power4.easeInOut' });

  // PAWS BACK LEFT

  const tPawBLRot = Math.random() * Math.PI / 2;
  const tPawBLY = -4 + Math.random() * 8;

  gsap.to(this.pawBL.rotation, {
    duration: sp / 2, x: tPawBLRot, ease: 'power1.easeInOut', yoyo: true, repeat: 2,
  });
  gsap.to(this.pawBL.position, {
    duration: sp / 2, y: tPawBLY, ease: 'power1.easeInOut', yoyo: true, repeat: 2,
  });

  // PAWS BACK RIGHT

  const tPawBRRot = Math.random() * Math.PI / 2;
  const tPawBRY = -4 + Math.random() * 8;
  gsap.to(this.pawBR.rotation, {
    duration: sp / 2, x: tPawBRRot, ease: 'power1.easeInOut', yoyo: true, repeat: 2,
  });
  gsap.to(this.pawBR.position, {
    duration: sp / 2, y: tPawBRY, ease: 'power1.easeInOut', yoyo: true, repeat: 2,
  });

  // PAWS FRONT LEFT

  const tPawFLRot = Math.random() * Math.PI / 2;
  const tPawFLY = -4 + Math.random() * 8;

  gsap.to(this.pawFL.rotation, {
    duration: sp / 2, x: tPawFLRot, ease: 'power1.easeInOut', yoyo: true, repeat: 2,
  });

  gsap.to(this.pawFL.position, {
    duration: sp / 2, y: tPawFLY, ease: 'power1.easeInOut', yoyo: true, repeat: 2,
  });

  // PAWS FRONT RIGHT

  const tPawFRRot = Math.random() * Math.PI / 2;
  const tPawFRY = -4 + Math.random() * 8;

  gsap.to(this.pawFR.rotation, {
    duration: sp / 2, x: tPawFRRot, ease: 'power1.easeInOut', yoyo: true, repeat: 2,
  });

  gsap.to(this.pawFR.position, {
    duration: sp / 2, y: tPawFRY, ease: 'power1.easeInOut', yoyo: true, repeat: 2,
  });

  // MOUTH
  const tMouthRot = Math.random() * Math.PI / 8;
  gsap.to(this.mouth.rotation, sp, { x: tMouthRot, ease: 'power1.easeInOut' });
  // IRIS
  const tIrisY = -1 + Math.random() * 2;
  const tIrisZ = -1 + Math.random() * 2;
  const iris1 = this.iris;
  const iris2 = this.eyeR.children[0];
  gsap.to([iris1.position, iris2.position], {
    duration: sp, y: tIrisY, z: tIrisZ, ease: 'power1.easeInOut',
  });

  // EYES
  if (Math.random() > 0.2) {
    gsap.to([this.eyeR.scale, this.eyeL.scale], sp / 8, {
      y: 0, ease: 'power1.easeInOut', yoyo: true, repeat: 1,
    });
  }
};

Bunny.prototype.hang = function () {
  const _this = this;
  const sp = 1;
  const ease = 'power4.easeOut';

  gsap.killTweensOf(this.eyeL.scale);
  gsap.killTweensOf(this.eyeR.scale);

  this.body.rotation.x = 0;
  this.torso.rotation.x = 0;
  this.body.position.y = 0;
  this.torso.position.y = 7;

  gsap.to(this.mesh.rotation, { duration: sp, y: 0, ease });
  gsap.to(this.mesh.position, {
    duration: sp, y: -7, z: 6, ease,
  });
  gsap.to(this.head.rotation, {
    duration: sp, x: Math.PI / 6, ease, onComplete () { _this.nod(); },
  });

  gsap.to(this.earL.rotation, { duration: sp, x: Math.PI / 3, ease });
  gsap.to(this.earR.rotation, { duration: sp, x: Math.PI / 3, ease });

  gsap.to(this.pawFL.position, {
    duration: sp, y: -1, z: 3, ease,
  });
  gsap.to(this.pawFR.position, {
    duration: sp, y: -1, z: 3, ease,
  });
  gsap.to(this.pawBL.position, {
    duration: sp, y: -2, z: -3, ease,
  });
  gsap.to(this.pawBR.position, {
    duration: sp, y: -2, z: -3, ease,
  });

  gsap.to(this.eyeL.scale, { duration: sp, y: 1, ease });
  gsap.to(this.eyeR.scale, { duration: sp, y: 1, ease });
};

function createBunny (scene, initialPos) {
  const bunny = new Bunny();
  bunny.mesh.rotation.y = Math.PI / 2;
  scene.add(bunny.mesh);
  bunny.mesh.position.x = initialPos.x;
  bunny.mesh.position.y = initialPos.y;
  bunny.mesh.position.z = initialPos.z;
  bunny.nod();
  return bunny;
}

module.exports = { createBunny };
