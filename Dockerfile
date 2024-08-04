FROM node:alpine3.20

RUN  apk update && apk upgrade 

WORKDIR /app

COPY . .

RUN npm i

CMD [ "npm", "run", "dev" ]