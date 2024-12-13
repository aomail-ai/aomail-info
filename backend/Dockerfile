# Base stage for building the application
FROM gradle:jdk23 AS base
WORKDIR /app
COPY . .
RUN gradle bootJar

# Development mode
FROM base AS production
COPY --from=base /app/build/libs/*.jar app.jar
EXPOSE 8086
ARG BASE_URL
CMD ["java", "-jar", "app.jar"]
