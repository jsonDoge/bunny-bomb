const THREE = require('three');

const getVertices = (positionArray) => {
  const vertices = [];
  for (let i = 0; i < positionArray.length; i += 3) {
    vertices.push(new THREE.Vector3(positionArray[i], positionArray[i + 1], positionArray[i + 2]));
  }
  return vertices;
};

const convertVectorToIndex = (vector, baseVector, stepSize) => {
  const x = (vector.x - baseVector.x) / stepSize;
  const y = (vector.z - baseVector.z) / stepSize;
  return x * 2 + y;
};

const convertIndexToVector = (index, baseVector, stepSize) => {
  const y = index % 2;
  const x = (index - y) / 2;
  return {
    x: (x * stepSize) + baseVector.x,
    y: baseVector.y,
    z: (y * stepSize) + baseVector.z,
  };
};

module.exports = { getVertices, convertVectorToIndex, convertIndexToVector };
