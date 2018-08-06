# sneakyBot
Node.js Telegram bot microservices example.

This bot scrapes selected url in some intrval, check it content and notify user for changes.

Read more about this project: https://medium.com/@denismalykhin/building-microservices-for-telegram-bot-using-node-js-rabbitmq-mongodb-and-docker-from-scratch-12640d172b8f

## How to run

- First, you should generate BOT_TOKEN here `https://telegram.me/botfather` and add it to the `/bot/environment`
- Second, run `npm install` for dependencies installation 
- Third, just run `docker-compose up` it will start all containers automatically. 

There are nodemon watchers in each container, so local changes in the code will restart node processes.
