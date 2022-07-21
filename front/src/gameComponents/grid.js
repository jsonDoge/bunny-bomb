const THREE = require('three');
const { cloneDeep } = require('lodash');
const { grassMat, redMat } = require('./materials');

const Grid = function (gridOffset, isRunner) {
  this.grid = new THREE.Group();
  for (let i = 0; i < 4; i += 1) {
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const blockMesh = isRunner
      ? new THREE.Mesh(planeGeometry, cloneDeep(grassMat))
      : new THREE.Mesh(planeGeometry, cloneDeep(redMat));
    blockMesh.rotation.x = -Math.PI / 2;

    blockMesh.receiveShadow = true;

    blockMesh.onClick = () => {
      blockMesh.material.opacity = 1;
    };

    blockMesh.unClick = () => {
      blockMesh.material.opacity = 0;
    };

    const geometry = new THREE.EdgesGeometry(planeGeometry);
    const material = new THREE.LineBasicMaterial({
      color: 0xf0f0ff, linewidth: 2, opacity: 0.7, transparent: true,
    });
    const edges = new THREE.LineSegments(geometry, material);

    blockMesh.add(edges);
    blockMesh.position.set((i % 2) * 50, 0, (i > 1 && 1) * 50);

    this.grid.add(blockMesh);
  }

  this.grid.position.setX(gridOffset?.x || 0);
  this.grid.position.setY(gridOffset?.y || 0);
  this.grid.position.setZ(gridOffset?.z || 0);
  // this.grid.receiveShadow = true;
};

function createGrid (scene, gridOffset, isRunner) {
  const gridWrapper = new Grid(gridOffset, isRunner);
  scene.add(gridWrapper.grid);
  return gridWrapper;
}

module.exports = { createGrid };
