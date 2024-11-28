# Base stage for building the application
FROM gradle:jdk23 AS base
WORKDIR /app
COPY . .
RUN gradle bootJar

# Development mode
FROM base AS development
COPY --from=base /app/build/libs/*.jar app.jar
EXPOSE 8000
CMD ["java", "-jar", "app.jar"]
