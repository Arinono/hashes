FROM node:alpine

RUN npm i

COPY . .

ENTRYPOINT ['node', 'app.js']
