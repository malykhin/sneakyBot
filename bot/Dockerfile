FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./bot/src ./bot/src
COPY ./common ./common
EXPOSE 80
CMD [ "npm", "run", "start:bot" ]
