FROM node:14 as base
WORKDIR /src
COPY package*.json ./
EXPOSE 8000

FROM base as dev
RUN npm install
COPY . .
