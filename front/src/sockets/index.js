const { io } = require('socket.io-client');

const { BACKEND_URL } = process.env;

const socket = io(BACKEND_URL);

const allEventNames = [
  'runner left',
  'round over',
  'game over',
  'start game',
  'join result',
];

const joinGameServer = (runner, cb) => {
  socket.emit('join', runner);

  socket.once('join result', (response) => {
    cb(response.error);
  });
};

socket.on('disconnect', () => {
  console.debug('You have been disconnected');
});

const sendAction = (actions) => {
  socket.emit('action', actions);
};

// available : 'start game' | 'round over' | 'game over'
const listenFor = (eventName, cb) => socket.on(eventName, cb);

const listenForOnce = (eventName, cb) => socket.once(eventName, cb);

const removeListenerFor = (eventName) => socket.removeAllListeners(eventName);

const sendRestartGame = () => {
  socket.emit('restart');
};

const clearAllListeners = () => {
  allEventNames.forEach((e) => socket.removeAllListeners(e));
};

socket.io.on('reconnect', () => {
  console.debug('You have been reconnected');
});

socket.io.on('reconnect_error', () => {
  console.error('attempt to reconnect has failed');
});

module.exports = {
  joinGameServer,
  listenFor,
  listenForOnce,
  removeListenerFor,
  sendRestartGame,
  sendAction,
  clearAllListeners,
};
