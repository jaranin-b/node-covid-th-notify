# first stage
FROM node:14.17-alpine as builder

COPY package*.json ./

RUN npm install --production
RUN npm ci --only=production

# second stage
FROM node:14.17-slim

RUN apt-get update
RUN apt-get install -y curl bash

WORKDIR /usr/src/app

COPY --from=builder node_modules node_modules

ENV NODE_ENV=production

COPY . .

CMD [ "node", "index.js" ]

EXPOSE 8080
