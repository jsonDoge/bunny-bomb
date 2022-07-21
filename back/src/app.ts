import 'dotenv/config';
import fastify from 'fastify';
import fastifySocket from 'fastify-socket.io';
import router from './router';
import gameSocket from './sockets';

const isDev = process.env.NODE_ENV === 'development';

const server = fastify({
  logger: !isDev,
});

server.register(router);

const socketOptions = process.env.FRONTEND_URL ? {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
} : {};

// game server
server.register(
  fastifySocket,
  socketOptions,
);
server.register(gameSocket);

export default server;
