# Base stage for building the application
FROM node:lts-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Development mode
FROM base AS production
EXPOSE 3000
CMD ["npm", "run", "build"]
#CMD ["npm", "preview", "--port", "3000"]