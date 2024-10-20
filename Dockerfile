FROM node:20-alpine

WORKDIR /app

COPY package*.json /app
RUN npm install

RUN npm install -g @nestjs/cli
RUN npm install -g prisma

COPY . .

RUN npx prisma generate --binary-targets native,linux-musl-openssl-3.0.x

EXPOSE 3333

CMD [ "nest", "start", "--watch" ]