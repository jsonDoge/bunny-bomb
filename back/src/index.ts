import app from './app';

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT);

console.debug(`🚀  Fastify server running on port ${PORT}`);
