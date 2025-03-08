# API

## Requirements

-   docker
-   docker-compose
-   node v18

## Setup

```bash
# start local postgres server
docker-compose up -d

# if postgres docker compose doesn't work on Windows
docker run --name postgres14 -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -d postgres:14-alpine

# install yarn package manager
npm i -g yarn

# install project dependencies
yarn install
```

## Run

```bash
yarn start
```

## Create a new migration

```bash
yarn migrate:make your-migration-name
```

## Run a seed

```bash
yarn seed:run --specific=your-migration-name.ts
```

## Run integration tests

```bash
# test once
yarn test
# rerun tests after files are changed
yarn test:watch
```

## Run artillery loadtest

```bash
npx artillery run artillery.yml
```
