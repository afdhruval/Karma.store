FROM node:20-alpine as frontend_builder

WORKDIR /app

COPY ./Frontend/package.json /app

RUN npm install

COPY ./Frontend /app

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY ./Backend/package*.json /app

RUN npm install

COPY ./Backend /app

COPY --from=frontend_builder /app/dist /app/public

CMD ["node" ,"server.js"]