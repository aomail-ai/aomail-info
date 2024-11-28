# Aomail Info Website

This project is a full-stack web application designed to showcase the features of [Aomail](https://aomail/), an
AI-powered email management app. It has been built to enable co-founders to create and publish articles that enhance the
website's SEO.

The website will feature articles about:

- Aomail's core features
- Tutorials and guides
- Bug fixes and updates
- Comparisons with other email management apps

## Tech Stack

- **Frontend:** Vite + React
- **Backend:** Spring Boot
- **Containerization:** Docker
- **Web Server:** Nginx

## Setup

### Requirements

To run this project locally, ensure you have the following installed:

- **JDK 23**
- **Node (latest version)**
- **Docker** (Docker Desktop if on Windows)
- **Git** (Git Bash if on Windows)

### Installation Steps

#### 1. Clone the repository

Start by cloning the repository:

```bash
git clone https://github.com/aomail-ai/aomail-info.git
cd aomail-info
```

#### 2. Without Docker

#### 2.1. Start the Backend Server

To start the Spring Boot backend server, you can either use **IntelliJ IDEA** or run the backend from the command line.

- Modify the `application.properties` file in the `backend/src/main/resources` directory to match your database
  configuration. For example:

```bash
spring.application.name=backend
spring.datasource.url=jdbc:postgresql://localhost:5433/aomailinfo
spring.datasource.username=postgres
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
logging.level.ai.aomail.info.backend=TRACE
logging.level.org.springframework.security=TRACE
```

- **Using IntelliJ IDEA:**
  If you have opened the project in IntelliJ IDEA, simply run the `BackendApplication.java` file to start the Spring
  Boot backend server.

- **Using the Command Line (with Gradle):**
  If you prefer to run the backend from the command line, follow these steps:

    1. Navigate to the backend directory:

       ```bash
       cd backend
       ```

    2. Build the application using Gradle:

       ```bash
       ./gradlew bootJar
       ```

       This will create a `.jar` file in the `build/libs` directory.

    3. Run the generated `.jar` file:

       ```bash
       java -jar build/libs/aomail-info-0.0.1-SNAPSHOT.jar
       ```

       Replace `aomail-info-0.0.1-SNAPSHOT.jar` with the actual name of your generated `.jar` file, if different.

The backend server should now be up and running.

##### 2.2. Start the Frontend Server

In a new terminal window, navigate to the frontend directory and run the following commands:

```bash
cd frontend
npm install
npm run dev
```

#### 3. With Docker

##### 3.1. Run in Development Mode

Create a script named `start_dev.sh` with the following content:

```bash
export POSTGRES_USER=<your_postgres_user>
export POSTGRES_PASSWORD=<your_postgres_password>
export POSTGRES_DB=<your_postgres_db>
export DB_PORT=<your_db_port>
export BACKEND_PORT=<your_backend_port>
export FRONTEND_PORT=<your_frontend_port>

docker-compose up --build -d frontend_dev backend_dev
```

Then run the script:

```bash
./start_dev.sh
```

##### 3.2. Run in Production Mode

Create a script named `build.sh` with the following content:

```bash
export POSTGRES_USER=<your_postgres_user>
export POSTGRES_PASSWORD=<your_postgres_password>
export POSTGRES_DB=<your_postgres_db>
export DB_PORT=<your_db_port>
export BACKEND_PORT=<your_backend_port>
export FRONTEND_PORT=<your_frontend_port>

docker-compose up --build -d frontend_prod backend_prod
```

Then run the script:

```bash
./build.sh
```
