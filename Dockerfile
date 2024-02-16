FROM node:16.9.1-slim as development

WORKDIR /usr/app

COPY package*.json .

COPY .env .

RUN npm install 

COPY . .

RUN npm run build

FROM node:16.9.1-slim as production

WORKDIR /usr/app

COPY --from=development ./usr/app/dist/package*.json .

RUN npm i -D drizzle-kit

COPY --from=development ./usr/app/dist .

COPY --from=development ./usr/app/.env .

COPY --from=development ./usr/app/drizzle.config.ts .

COPY --from=development ./usr/app/src/db/migrations ./src/db/migrations

EXPOSE 8080

CMD ["node", "server.js"]