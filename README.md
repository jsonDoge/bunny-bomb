# Bunny bomb game monorepo

Original frontend game from [Yakudoo](https://codepen.io/Yakudoo/) codepen [The frantic run of the valorous rabbit](https://codepen.io/Yakudoo/pen/YGxYej).

## Front

Three.js game of bear chasing bunny. Javascript with webpack packing, main libs used for animation:
- [Three.js](https://threejs.org/)
- [gsap](https://greensock.com/gsap/)

## Back

Backend to provide multiple player capabilities for chasing game. Currently a very simple solution allowing only a single game to run at any one time. Main libs:
 - [fastify](https://www.fastify.io/)

## Run

Check each subfolder README.md files for any specifics. Each one has an .env.example which can be renamed to .env for immediate start.

To run locally you'll need to start them separately by running

```yarn```

and then

```yarn dev```