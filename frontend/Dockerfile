# Base stage for building the application
FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
ARG BASE_URL
ENV VITE_BASE_URL=$BASE_URL
RUN npm run build

COPY . .
CMD [ "npm", "run", "preview" ]