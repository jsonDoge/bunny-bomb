/* eslint-disable no-param-reassign */
import { FastifyInstance } from 'fastify';
import { Socket } from 'socket.io';

type Runner = 'wolf' | 'bunny';

interface RunnerSockets {
  wolf: Socket | undefined;
  bunny: Socket | undefined;
}

interface RunnerActions {
  moveTo: number;
  throwTo: number;
}

interface AllRunnerActions {
  wolf?: RunnerActions;
  bunny?: RunnerActions;
}

let runnerSockets: RunnerSockets = {
  wolf: undefined,
  bunny: undefined,
};

let playerCount = 0;
let step = 1;
let score = 0; // 3 - bunny wins, -3 - wolf wins
let allRunnerActions: AllRunnerActions = {};
let runnersJoined: string[] = [];
let runnersRestarted: string[] = [];

// plots (<- camera view)
//  -------
// | 2 | 3 |
//  -------
// | 0 | 1 |
//  -------

// GAME STEPS
// 1 - joining "join"
// 2 - starting game (wait for actions) / round over (emit actions and result)
// "start game" / "round over"
// 3 - game over (emit actions, result and winner) "game over"

// PLAYER SOCKET
// runner: 'bunny'|'wolf'
// position: 0|1|2|3
//

const toAllRunners = (topic: string, data = {}) => {
  runnerSockets?.bunny?.emit(topic, data);
  runnerSockets?.wolf?.emit(topic, data);
};

export default async function socketController(fastify: FastifyInstance) {
  // GET /
  fastify.io.on('connection', function (socket) {
    let addedPlayer = false;

    // when the client emits 'add user', this listens and executes
    socket.on('join', (runner: Runner) => {
      if (step !== 1) {
        socket.emit('join result', { error: 'joining closed' });
        return;
      }

      if (addedPlayer) {
        socket.emit('join result', { error: 'you already joined' });
        return;
      }

      if (playerCount === 2) {
        socket.emit('join result', { error: 'game full' });
        return;
      }

      if (runnersJoined.includes(runner)) {
        socket.emit('join result', { error: `${runner} already joined` });
        return;
      }

      // we store the username in the socket session for this client
      (socket as any).runner = runner;
      runnersJoined.push(runner);
      (socket as any).position = 0;
      playerCount += 1;
      addedPlayer = true;
      runnerSockets[runner] = socket;

      socket.emit('join result', {
        playerCount, runner,
      });
      // echo globally (all clients) that a person has connected
      toAllRunners('player joined', {
        runner,
        position: (socket as any).position,
        playerCount,
      });

      if (playerCount === 2) {
        toAllRunners('start game');
        step = 2;
      }
    });

    socket.on('action', (actions: RunnerActions) => {
      if (step !== 2) {
        socket.emit('actions closed');
        return;
      }
      if (!addedPlayer) { return; }

      console.debug('---action received---');
      console.debug(actions);

      allRunnerActions[(socket as any).runner as Runner] = actions;

      if (Object.keys(allRunnerActions).length !== 2) {
        return;
      }

      if (allRunnerActions?.bunny?.throwTo === allRunnerActions?.wolf?.moveTo) {
        score += 1;
      }

      if (allRunnerActions?.wolf?.throwTo === allRunnerActions?.bunny?.moveTo) {
        score -= 1;
      }

      if (score >= 3 || score <= -3) {
        toAllRunners('game over', {
          allRunnerActions,
          winner: score > 0 ? 'bunny' : 'wolf',
          score,
        });
        step = 3;
        return;
      }

      toAllRunners('round over', {
        allRunnerActions,
        score,
      });

      allRunnerActions = {};
    });

    socket.on('restart', () => {
      if (step !== 3) {
        socket.emit('game not over');
        return;
      }
      if (!addedPlayer) { return; }

      if (runnersRestarted.includes((socket as any).runner)) {
        return;
      }

      runnersRestarted.push((socket as any).runner);

      if (runnersRestarted.length === 2) {
        console.debug('---restarting game---');
        toAllRunners('restart game');
        runnersRestarted = [];
        allRunnerActions = {};
        score = 0;
        step = 2;
      }
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
      if (addedPlayer) {
        console.debug('---user disconnect - resetting game---');
        playerCount = 0;
        runnersJoined = [];
        allRunnerActions = {};
        step = 1;
        score = 0;

        // echo globally that this client has left
        toAllRunners('runner left', {
          runner: (socket as any).runner,
          playerCount,
        });
        runnerSockets = {
          wolf: undefined,
          bunny: undefined,
        };
      }
    });
  });
}
