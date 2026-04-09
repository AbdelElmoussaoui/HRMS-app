# HR Management System

Full-stack HRMS with Spring Boot 3 (API) and Angular 16 (UI).

## Stack
- Backend: Spring Boot 3, Java 17, Maven, PostgreSQL, Spring Security (JWT)
- Frontend: Angular 16, Angular Material, SCSS

---

## Backend setup (Spring Boot)

1) Create PostgreSQL database and user:

```sql
CREATE DATABASE hrms;
CREATE USER hrms WITH PASSWORD 'hrms';
GRANT ALL PRIVILEGES ON DATABASE hrms TO hrms;
```

2) Configure app (optional overrides):

`hrms/src/main/resources/application.yml`
- `spring.datasource.*`
- `jwt.secret` (set to a long random value)
- `storage.location` (file uploads path)

3) Run the API:

```bash
cd hrms
./mvnw spring-boot:run
```

API runs at `http://localhost:8080`.

Swagger UI: `/swagger-ui`

---

## Frontend setup (Angular)

```bash
cd hrms-ui
npm install
npm start
```

UI runs at `http://localhost:4200` and proxies to `http://localhost:8080/api` based on `environment.ts`.

---

## Sample credentials

Create a user in the database with a BCrypt password hash. Example (pseudo):

```
Username: admin
Password: Admin123!
Role: ADMIN
Enabled: true
```

To generate a BCrypt hash, use a quick Java snippet:

```java
new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("Admin123!")
```

Then insert the user:

```sql
INSERT INTO users (username, password, role, enabled)
VALUES ('admin', '<bcrypt-hash-here>', 'ADMIN', true);
```

---

## Deployment instructions

### Backend
- Build:
  ```bash
  cd hrms
  ./mvnw clean package
  ```
- Run:
  ```bash
  java -jar target/hrms-0.0.1-SNAPSHOT.jar
  ```

Set environment variables for production:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `STORAGE_LOCATION`

### Frontend
- Build:
  ```bash
  cd hrms-ui
  npm run build
  ```
- Serve the built files from `hrms-ui/dist/hrms-ui` using Nginx or any static host.

Update `environment.prod.ts` to point to the production API base URL before building.

---

## Notes
- JWT auth uses stateless requests with `Authorization: Bearer <token>`.
- File uploads are stored on disk at `storage.location` and metadata is saved in the database.
- Role-based access control is enforced in the API via `@PreAuthorize`.
