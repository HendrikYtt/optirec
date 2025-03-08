FROM node:16-alpine
WORKDIR /usr/src/app

RUN yarn global add nodemon

COPY tsconfig.json package.json yarn.lock ./
RUN yarn

COPY . ./
RUN yarn lint
RUN yarn build

RUN chmod +x ./entrypoint.sh
ENTRYPOINT [ "./entrypoint.sh" ]
