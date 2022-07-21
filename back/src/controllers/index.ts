import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export default async function indexController(fastify: FastifyInstance) {
  // GET /
  fastify.get('/', async function (
    _request: FastifyRequest,
    reply: FastifyReply,
  ) {
    reply.send({ status: '🐇' });
  });
}
