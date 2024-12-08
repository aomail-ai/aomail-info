# Base stage for building the application
FROM node:lts-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Production mode
FROM base AS production
CMD ["npm", "run", "build"]

COPY --from=base /app/dist /app/dist
EXPOSE 3000
CMD ["npm", "run", "preview"]