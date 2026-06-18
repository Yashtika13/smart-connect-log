# Smart Wi-Fi Attendance & Analytics — Spring Boot Backend

Java 17 · Spring Boot 3.3 · Spring Security (JWT) · Spring Data JPA · MySQL 8 · springdoc-openapi

## Folder structure

```
backend/
├── pom.xml
├── sql/schema.sql
└── src/main/
    ├── java/com/smartwifi/attendance/
    │   ├── AttendanceApplication.java
    │   ├── config/        SecurityConfig, OpenApiConfig, WifiProperties
    │   ├── controller/    Auth, Device, Attendance, Leave, Notification, Analytics, Admin
    │   ├── dto/           Request/response DTOs
    │   ├── entity/        User, Device, Attendance, LeaveRequest, Notification, enums
    │   ├── exception/     ApiException, GlobalExceptionHandler
    │   ├── repository/    Spring Data JPA repositories
    │   ├── security/      JwtUtils, JwtAuthFilter, UserPrincipal, UserDetailsService
    │   └── service/       Auth, Device, Attendance, Leave, Notification, Analytics
    └── resources/application.properties
```

## Prerequisites

- JDK 17+
- Maven 3.9+
- MySQL 8 running locally (or update `application.properties`)

## Setup

1. Create the database (optional — `createDatabaseIfNotExist=true` does this automatically):
   ```bash
   mysql -u root -p < backend/sql/schema.sql
   ```
2. Edit `backend/src/main/resources/application.properties`:
   - `spring.datasource.username` / `spring.datasource.password`
   - `app.jwt.secret` (base64 string, min 32 bytes)
   - `app.wifi.allowed-ssids` and `app.wifi.allowed-bssids` (your campus/office Wi-Fi)
   - `app.cors.allowed-origins` (your frontend URL)
3. Build & run:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The API starts on `http://localhost:8080/api`.
4. Swagger UI: `http://localhost:8080/api/swagger-ui.html`

## Default admin

After first boot, register an admin via:
```
POST /api/auth/register
{
  "username":"admin", "email":"admin@local", "password":"Admin@123",
  "fullName":"Admin", "department":"IT", "role":"ADMIN"
}
```

## Key REST endpoints

| Method | Path                              | Auth         | Description                          |
|--------|-----------------------------------|--------------|--------------------------------------|
| POST   | /auth/register                    | Public       | Create account                       |
| POST   | /auth/login                       | Public       | Returns JWT                          |
| GET    | /devices/me                       | User         | List my devices                      |
| POST   | /devices/me                       | User         | Register device (MAC binding)        |
| DELETE | /devices/me/{id}                  | User         | Remove device                        |
| POST   | /devices/{id}/verify              | ADMIN        | Approve device                       |
| POST   | /attendance/check-in              | User         | Wi-Fi + device verified check-in     |
| POST   | /attendance/check-out             | User         | Mark check-out                       |
| GET    | /attendance/me                    | User         | My attendance history                |
| GET    | /attendance/by-date?date=...      | STAFF/ADM  | Daily attendance sheet               |
| POST   | /leaves                           | User         | Submit leave request                 |
| GET    | /leaves/me                        | User         | My leave history                     |
| GET    | /leaves/pending                   | STAFF/ADM  | Pending requests                     |
| PATCH  | /leaves/{id}/decision             | STAFF/ADM  | Approve / reject                     |
| GET    | /notifications/me                 | User         | My notifications                     |
| PATCH  | /notifications/{id}/read          | User         | Mark read                            |
| GET    | /analytics/dashboard              | STAFF/ADM  | KPIs + last-7-days series            |
| GET    | /admin/users                      | ADMIN        | List all users                       |
| PATCH  | /admin/users/{id}/toggle          | ADMIN        | Enable / disable user                |

All non-public endpoints require `Authorization: Bearer <jwt>`.

## How Wi-Fi + device verification works

`POST /attendance/check-in` requires:
- `macAddress` — must match a device registered AND verified to the calling user
- `wifiSsid` / `wifiBssid` — must match one of `app.wifi.allowed-ssids` / `allowed-bssids`
- Server records IP, timestamps, and computes `PRESENT` / `LATE` based on a 09:30 threshold.

## Frontend integration (TanStack / React)

The frontend is already wired to this backend through a typed API layer:

```
src/lib/api/
  client.ts       fetch wrapper + JWT token store + ApiError
  auth.ts         login / register / logout
  attendance.ts   check-in / check-out / history
  leave.ts        request / approve / reject
  device.ts       MAC registration & verification
  analytics.ts    dashboard KPIs
src/lib/auth-context.tsx   React context: user, role, signIn/out, hasRole
```

Pages use TanStack Query (`useQuery` / `useMutation`) with loading + error UI.
`_app/route.tsx` is the protected layout — it redirects to `/login` when no
JWT is present and exposes role-based UI (e.g. STAFF/ADMIN see "Pending
Approvals" on the Leave page).

### Steps to run end-to-end

1. Start MySQL and run `backend/sql/schema.sql` (creates DB + tables + seed admin).
2. `cd backend && mvn spring-boot:run` — API on `http://localhost:8080/api`.
3. In the frontend project root, copy `.env.example` to `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
4. Ensure `app.cors.allowed-origins` in `application.properties` contains
   your frontend origin (default already includes `http://localhost:5173`).
5. Start the frontend dev server. Visit `/login`, sign in with the seeded
   admin (`admin` / `admin123` from `schema.sql`) or a registered user.

### Roles

`ADMIN`, `STAFF`, `STUDENT` — enforced both server-side (`@PreAuthorize`)
and client-side via `useAuth().hasRole(...)` for conditional UI.


## Production checklist

- Replace `app.jwt.secret` with a strong random base64 secret (>= 32 bytes).
- Set `spring.jpa.hibernate.ddl-auto=validate` and manage schema via Flyway/Liquibase.
- Lock down `app.cors.allowed-origins` to your domain(s) only.
- Run behind HTTPS; set HSTS at the reverse proxy.
- Rotate the seeded admin password immediately.
