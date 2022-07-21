require('./loadStyles');
require('@babel/polyfill');

const {
  init,
  subscribeToPlayerActions,
  showActionResult,
  openActionSelection,
  setRunnerDistance,
  resetGame,
  preloadModels,
} = require('./game');

const {
  showAvatarSelectionModal,
  getRunnerSelect,
  showScore,
  showWaitingMessage,
  hideWaitingMessage,
  showErrorMessage,
  setScore,
  showGameOver,
  hideWaitingForOpponent,
  showWaitingForOpponent,
  listenOnRestartOnce,
  hideGameOver,
} = require('./ui');

const {
  joinGameServer,
  listenForOnce,
  removeListenerFor,
  sendAction,
  listenFor,
  clearAllListeners,
  sendRestartGame,
} = require('./sockets');

const showMenu = async () => {
  try {
    await showAvatarSelectionModal();
    const runner = getRunnerSelect();

    await connectServer(runner);
    showWaitingMessage('Waiting for other player...');

    await onSocketGameStart();
    hideWaitingMessage();

    await runGame(runner);
  } catch (e) {
    hideWaitingMessage();
    showErrorMessage(e, showMenu);
    removeListenerFor('start game');
  }
};

const connectServer = async (runner) =>
  new Promise((resolve, reject) => {
    joinGameServer(runner, (error) => {
      if (error) { return reject(error); }

      return resolve();
    });
  });

const runGame = async (runner) => {
  await preloadModels();
  init(runner);
  showScore();
  initGameSocketListeners(runner);
};

const onSocketGameStart = () =>
  new Promise((resolve) => { listenForOnce('start game', resolve); });

const initGameSocketListeners = () => {
  openActionSelection();

  listenForOnce('runner left', () => {
    console.info('---Runner left---');
    window.location.reload();
  });

  subscribeToPlayerActions((data) => {
    sendAction(data);
    showWaitingForOpponent();
  });

  listenFor('round over', ({ allRunnerActions, score }) => {
    hideWaitingForOpponent();
    const {
      bunny: {
        moveTo: bunnyMoveTo,
        throwTo: bunnyThrowTo,
      },
      bear: {
        moveTo: bearMoveTo,
        throwTo: bearThrowTo,
      },
    } = allRunnerActions;

    showActionResult(bearMoveTo, bunnyMoveTo, bearThrowTo, bunnyThrowTo, () => {
      setScore(score);
      setRunnerDistance(score);
      openActionSelection();
    });
  });

  listenForOnce('game over', ({ allRunnerActions, winner, score }) => {
    listenOnRestartOnce(() => {
      hideGameOver();

      sendRestartGame();
      showWaitingForOpponent();
    });

    hideWaitingForOpponent();
    const {
      bunny: {
        moveTo: bunnyMoveTo,
        throwTo: bunnyThrowTo,
      },
      bear: {
        moveTo: bearMoveTo,
        throwTo: bearThrowTo,
      },
    } = allRunnerActions;

    showActionResult(bearMoveTo, bunnyMoveTo, bearThrowTo, bunnyThrowTo, () => {
      setScore(score);
      setRunnerDistance(score);
      showGameOver(winner);
    });
  });

  listenForOnce('restart game', () => {
    clearAllListeners();
    hideWaitingForOpponent();
    setScore(0);
    resetGame();

    initGameSocketListeners();
  });
};

if (process.env.ANIMATE_ONLY) {
  // FOR TESTING

  window.addEventListener('load', () => {
    hideWaitingMessage();
    preloadModels().then(() => {
      init('bunny');
      showScore();
      openActionSelection();
    });
  }, false);
} else {
  window.addEventListener('load', showMenu, false);
}
