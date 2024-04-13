# Telegram Bot

## Description

The official TogetherCrew focused around data ingestion.

## Installation

- Create a telegram bot using BotFather
- Add the bot token to your .env file
- Add your bot to your chat (NOTE: It must be an admin to capture reactions)
- Start docker compose (for mongodb + neo4j)

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev [service]

# production mode
$ npm run start:prod [service]
```

Note: There are 3 services:
- bot
- event-store (raw dump to mongo)
- graph-store (creates interactions in neo4j)

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Features

- Listens to Telegram events
- Store raw events in mongo
- Store interactions in neo4j

NOTE: The telegram bot api doesn't support listening to delete events at this time.

## Improvement opportunities

- Break the `REACTED_TO` edge into 3 cases. `REACTED_TO`, `EDITED_REACTION`, and `REMOVED_REACTION`.