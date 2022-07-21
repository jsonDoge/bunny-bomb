const THREE = require('three');

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const onDocumentMouseDown = (
  renderer,
  camera,
  playerGrid,
  opponentGrid,
  getIsActionsAllowed,
  submitAction,
) => (event) => {
  event.preventDefault();

  if (!getIsActionsAllowed()) { return; }

  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const movementIntersection = raycaster.intersectObjects(playerGrid);
  const attackIntersection = raycaster.intersectObjects(opponentGrid);

  // .onClick check added so edges would not trigger intersection
  if (movementIntersection.length > 0 && movementIntersection[0].object.onClick) {
    playerGrid.forEach((o) => { o.unClick(); });
    movementIntersection[0].object.onClick();

    const { position } = movementIntersection[0].object;
    const moveToPosition = new THREE.Vector3(0, 0, 0)
      .add(position).add(movementIntersection[0].object.parent.position);

    submitAction('moveTo', moveToPosition);
  } else if (attackIntersection.length > 0 && attackIntersection[0].object.onClick) {
    opponentGrid.forEach((o) => { o.unClick(); });
    attackIntersection[0].object.onClick();

    const { position } = attackIntersection[0].object;
    const throwToPosition = new THREE.Vector3(0, 0, 0)
      .add(position).add(attackIntersection[0].object.parent.position);
    submitAction('throwTo', throwToPosition);
  }
};

const createMouseDownHandler = (
  renderer,
  camera,
  playerGrid,
  opponentGrid,
  getIsActionsAllowed,
  submitAction,
) => {
  document.getElementById('world').addEventListener(
    'mousedown',
    onDocumentMouseDown(
      renderer,
      camera,
      playerGrid,
      opponentGrid,
      getIsActionsAllowed,
      submitAction,
    ),
  );
};
module.exports = { createMouseDownHandler };
