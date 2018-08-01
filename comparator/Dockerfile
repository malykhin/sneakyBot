FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./comparator/src ./comparator/src
COPY ./common ./common
EXPOSE 80
CMD [ "npm", "run", "start:comparator" ]
