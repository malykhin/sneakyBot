FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./crawler ./crawler
COPY ./common ./common
EXPOSE 80
CMD [ "npm", "run", "start:crawler" ]
