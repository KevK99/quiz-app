# Quiz App

A full-stack quiz application built with **Spring Boot** (backend) and **Next.js** (frontend).

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Backend  | Java 17, Spring Boot 4, Spring Data JPA, Lombok |
| Frontend | Next.js 16, React 18, TypeScript  |
| Database | MariaDB                           |

---

## Prerequisites

- Java 17+
- Node.js 18+
- A running MariaDB instance (see below)

---

## Database Setup

### Option A — Docker (recommended)

Create a `docker-compose.yml` in the project root:

```yaml
services:
  mariadb:
    image: mariadb:11
    container_name: quiz-db
    restart: unless-stopped
    environment:
      MARIADB_ROOT_PASSWORD: root
      MARIADB_DATABASE: quiz
    ports:
      - "3307:3306"
    volumes:
      - quiz-db-data:/var/lib/mysql

volumes:
  quiz-db-data:
```

Then start the container:

```bash
docker-compose up -d
```

### Option B — Manual

Create a database named `quiz` and a user with access to it, then update `application.yaml` accordingly.

---

## Configuration

The backend reads its database connection from `backend/src/main/resources/application.yaml`:

```yaml
spring:
  datasource:
    url: jdbc:mariadb://localhost:3307/quiz
    username: root
    password: root
```

Adjust `url`, `username` and `password` to match your setup.

> **Note:** `ddl-auto: create` is currently set, which means the schema is **dropped and recreated** on every startup. Change this to `validate` or `update` once you move past the development phase.

---

## Running the Backend

```bash
cd backend
./gradlew bootRun
```

The API will be available at `http://localhost:8080`.

On the first start, Spring will create the schema and run `data.sql` to seed the database with sample categories and questions.

---

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## API Overview

| Method | Endpoint                                  | Description                        |
|--------|-------------------------------------------|------------------------------------|
| GET    | `/api/categories`                         | All categories with user progress  |
| GET    | `/api/categories/{id}/next-question`      | Next unanswered question           |
| POST   | `/api/questions/{id}/answer`              | Submit an answer                   |

---

## Project Structure

```
quiz-app/
├── backend/
│   └── src/main/java/de/kevinKlebula/quiz/
│       ├── controller/   # REST endpoints
│       ├── service/      # Business logic
│       ├── repository/   # Spring Data JPA interfaces
│       ├── entity/       # JPA entities (Question, Category, UserProgress)
│       ├── dto/          # Data transfer objects
│       ├── api/          # ApiResponse wrapper & factory
│       └── exception/    # Global exception handling
└── frontend/
    ├── app/
    │   ├── page.tsx              # HomePage (start + results screen)
    │   └── category/[id]/page.tsx # Quiz page
    ├── components/
    │   ├── ProgressBar.tsx
    │   ├── CategoryCard.tsx
    │   └── QuestionCard.tsx
    └── lib/
        ├── api.ts    # All fetch calls to the backend
        └── types.ts  # TypeScript types mirroring backend DTOs
```
