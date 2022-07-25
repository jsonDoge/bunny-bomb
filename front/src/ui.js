const initUI = () => {
  // fieldDistance = document.getElementById("distValue");
  // fieldGameOver = document.getElementById("gameover");
};

const showGameOver = (winner) => {
  const gameOver = document.getElementById('gameOver');
  const winnerMessage = document.getElementById('winnerMessage');
  winnerMessage.textContent = `winner ${winner}`;
  gameOver.style.display = 'block';
};

const hideGameOver = () => {
  const gameOver = document.getElementById('gameOver');
  gameOver.style.display = 'none';
};

const listenOnStartOnce = (cb) => {
  const startButton = document.getElementById('startGame');
  startButton.addEventListener('mousedown', cb, { once: true });
};

const listenOnErrorConfirmOnce = (cb) => {
  const errorConfirmButton = document.getElementById('errorConfirm');
  errorConfirmButton.addEventListener('mousedown', cb, { once: true });
};

const listenOnRestartOnce = (cb) => {
  const startButton = document.getElementById('restartGame');
  startButton.addEventListener('mousedown', cb, { once: true });
};

const backdropOn = () => {
  const backdrop = document.getElementById('backdrop');
  backdrop.style.display = 'block';
};

const backdropOff = () => {
  const backdrop = document.getElementById('backdrop');
  backdrop.style.display = 'none';
};

const getRunnerSelect = () => {
  const runnerSelect = document.getElementById('runnerSelect');
  return runnerSelect?.value;
};

const showScore = () => {
  document.getElementById('score').style.display = 'block';
};

const setScore = (score) => {
  let prefix = score < 0 ? 'wolf' : 'bunny';
  prefix = score === 0 ? '' : prefix;

  document.getElementById('value').textContent = `${prefix} ${Math.abs(score)}`;
};

const showAvatarSelectionModal = async () => new Promise((resolve) => {
  backdropOn();
  const intro = document.getElementById('intro');
  intro.style.display = 'block';
  listenOnStartOnce(() => {
    backdropOff();
    intro.style.display = 'none';
    resolve();
  });
});

const showWaitingForOpponent = () => {
  const waitingForOpponent = document.getElementById('waitingForOpponent');
  waitingForOpponent.style.display = 'block';
};

const hideWaitingForOpponent = () => {
  const waitingForOpponent = document.getElementById('waitingForOpponent');
  waitingForOpponent.style.display = 'none';
};

const showWaitingMessage = (message) => {
  backdropOn();
  const waitingRoom = document.getElementById('waitingRoom');
  const waitingMessage = document.getElementById('waitingMessage');
  waitingMessage.textContent = message;
  waitingRoom.style.display = 'block';
};

const hideWaitingMessage = () => {
  backdropOff();
  const waitingRoom = document.getElementById('waitingRoom');
  waitingRoom.style.display = 'none';
};

const showErrorMessage = (message, cb) => {
  backdropOn();
  const errorRoom = document.getElementById('errorRoom');
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = message;
  errorRoom.style.display = 'block';
  listenOnErrorConfirmOnce(() => {
    backdropOff();
    errorRoom.style.display = 'none';
    cb();
  });
};

module.exports = {
  initUI,
  showAvatarSelectionModal,
  getRunnerSelect,
  showScore,
  setScore,
  showWaitingMessage,
  hideWaitingMessage,
  showErrorMessage,
  showWaitingForOpponent,
  hideWaitingForOpponent,
  listenOnStartOnce,
  listenOnRestartOnce,
  showGameOver,
  hideGameOver,
};
