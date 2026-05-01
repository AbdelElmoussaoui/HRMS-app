# HRMS — Human Resource Management System

Full-stack HRMS with Spring Boot 3 (API) and Angular 16 (UI) — premium UI/UX with dark mode, live dashboard and demo data.

## Screenshots

<!-- TODO: add screenshots after first launch -->
| Dashboard (Light) | Dashboard (Dark) |
|---|---|
| ![Dashboard light](docs/screenshots/dashboard-light.png) | ![Dashboard dark](docs/screenshots/dashboard-dark.png) |

| Login | Employee List |
|---|---|
| ![Login](docs/screenshots/login.png) | ![Employees](docs/screenshots/employees.png) |

| Leave Approvals |
|---|
| ![Leave](docs/screenshots/leave-approvals.png) |

---

## Demo credentials

The app seeds demo data automatically on first launch.

```
Username: admin
Password: admin123
```

**Included demo data:** 5 departments · 12 employees · 15 leave requests (PENDING / APPROVED / REJECTED)

---

## Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3, Java 17, Maven, PostgreSQL, Spring Security (JWT) |
| Frontend | Angular 16, Angular Material 16, SCSS, Chart.js |
| Infrastructure | Docker, Docker Compose, Nginx |

---

## Quick start (Docker Compose)

```bash
docker compose up --build
```

- UI:  http://localhost:4200
- API: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui

---

## Local development

### Backend

```sql
-- PostgreSQL
CREATE DATABASE hrms;
CREATE USER hrms WITH PASSWORD 'hrms';
GRANT ALL PRIVILEGES ON DATABASE hrms TO hrms;
```

```bash
cd hrms
./mvnw spring-boot:run
# API → http://localhost:8080
```

### Frontend

```bash
cd hrms-ui
npm install
npm start
# UI → http://localhost:4200
```

---

## Features

- **Dashboard** — live stat cards with trend indicators, headcount history line chart, leave breakdown doughnut, recent activity feed, top departments by headcount
- **Employees** — CRUD with search, sort, pagination; responsive card view on mobile
- **Departments** — CRUD with search, sort, pagination
- **Leave requests** — CRUD with employee autocomplete search; manager approval workflow
- **Dark mode** — full dark theme persisted in localStorage, toggled from the sidebar
- **Responsive** — sidebar collapses on mobile (≤ 768 px), employee table switches to card view
- **Toast notifications** — global top-right toast system replacing Material snackbars

---

## Deployment

### Backend

```bash
cd hrms
./mvnw clean package
java -jar target/hrms-0.0.1-SNAPSHOT.jar
```

Environment variables:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`

### Frontend

```bash
cd hrms-ui
npm run build
# Serve hrms-ui/dist/hrms-ui with Nginx
```

Update `environment.prod.ts` with the production API base URL before building.

---

## Notes

- JWT auth is stateless — `Authorization: Bearer <token>` on every request
- Role-based access control via `@PreAuthorize` on the API
- Demo data is seeded once (guard: `existsByNameIgnoreCase("Engineering")`)