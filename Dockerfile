FROM node:slim AS base

WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .

FROM base AS prod-deps
RUN pnpm install --prod --frozen-lockfile

FROM base AS build
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM base AS production
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

CMD [ "pnpm", "start:prod" ]