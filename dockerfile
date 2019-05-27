FROM node:8.10.0

ADD . /ethapp

WORKDIR /ethapp

RUN yarn --pure-lockfile

EXPOSE 3000

# CMD [ "yarn", "dev" ]
