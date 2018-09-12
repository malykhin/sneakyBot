FROM node:latest

ARG service_src

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ${service_src} ./service/src
COPY ./common ./common
CMD [ "npm", "run", "start" ]
