FROM node:alpine AS development

WORKDIR /usr/src/app

RUN apk update
RUN apk add --update --no-cache python3 make g++

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

FROM development AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD [ "node", "dist/main" ]