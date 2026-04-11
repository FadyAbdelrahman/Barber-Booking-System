# Sharp Society — Barber Booking System
## Technical Report
### B8IT146 — Web Application Development | Dublin Business School

---

## 1. Project Overview

Sharp Society is a full-stack web application that allows customers to browse barbers, select services, and book appointments online. The system also provides an admin dashboard for managing barbers, services, and appointment statuses.

The application was built as a group CA project for the B8IT146 module, using a modern JavaScript stack consisting of React on the front end and Node.js/Express on the back end, connected to a MySQL relational database.

---

## 2. Technology Stack

| Layer | Technology | Version | Justification |
|---|---|---|---|
| Frontend | React | 19 | Industry-standard component-based UI library |
| Build Tool | Vite | 6 | Fast hot-reload and optimised production builds |
| UI Library | Material-UI (MUI) | 7 | Accessible, themeable component system |
| Animations | Framer Motion | 12 | Declarative page and component animations |
| HTTP Client | Axios | 1 | Promise-based HTTP with interceptor support |
| Routing | React Router | 7 | Declarative client-side routing |
| Backend | Node.js + Express | 5 | Lightweight, non-blocking REST API server |
| Auth | JSON Web Tokens | — | Stateless, scalable authentication |
| Password | bcryptjs | 3 | Secure one-way password hashing |
| Validation | express-validator | 7 | Server-side input validation middleware |
| Database | MySQL | 8 | Relational DBMS required by the module brief |
| DB Driver | mysql2 | 3 | Promise-based MySQL client for Node.js |

---

## 3. Application Architecture

The application follows a standard three-tier architecture:

```
┌─────────────────────┐     HTTP/REST      ┌─────────────────────┐
│   React Frontend    │ ◄────────────────► │   Express Backend   │
│   (Vite, port 5173) │                    │   (Node, port 5000) │
└─────────────────────┘                    └──────────┬──────────┘
                                                      │ mysql2
                                           ┌──────────▼──────────┐
                                           │   MySQL Database     │
                                           │  (barber_booking)    │
                                           └─────────────────────┘
```

The frontend never communicates with the database directly. All data flows through the REST API, which handles authentication, validation, and business logic before querying the database.

---

## 4. Frontend — Pages and Features

The frontend consists of **11 pages** accessible via React Router v7:

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero section with brand identity and value propositions |
| `/services` | Services Catalogue | Browse all services with search and category filter |
| `/services/:id` | Service Details | Individual service page with booking CTA |
| `/book` | Book | Service selection step |
| `/book-appointment` | Book Appointment | 4-step stepper: Service → Barber → Date/Time → Confirm |
| `/booking-confirmation` | Confirmation | Success page with appointment summary |
| `/dashboard` | Dashboard | User welcome screen with quick action cards |
| `/my-bookings` | My Bookings | View upcoming/past appointments; cancel bookings |
| `/login` | Login | Username + password with client-side validation |
| `/register` | Register | Full registration form with 6-field validation |
| `/admin/manage-slots` | Admin Panel | Barber CRUD, service CRUD, appointment management |

### Client-Side Validation

Both the Login and Register pages implement client-side validation before the API request is made:

- **Register**: username ≥ 3 chars, name ≥ 2 chars, valid email format, password ≥ 6 chars, passwords match, phone optional
- **Login**: username and password required, errors displayed inline beneath each field

### Authentication Flow

1. User submits login credentials
2. Backend verifies credentials, returns a JWT token
3. Token is stored in `localStorage`
4. Axios request interceptor automatically adds `Authorization: Bearer <token>` to every subsequent request
5. `AuthContext` provides global `user` state across all components
6. Token is loaded on application mount via `GET /api/auth/me`

---

## 5. Backend — API Endpoints

The REST API is hosted at `http://localhost:5000/api`.

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Create account; validates and hashes password |
| POST | `/login` | Public | Verify credentials; return JWT |
| GET | `/me` | Token | Return current logged-in user profile |

### Barbers (`/api/barbers`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | List all available barbers |
| GET | `/all` | Admin | List all barbers including inactive |
| GET | `/:id` | Public | Single barber details |
| POST | `/` | Admin | Add new barber |
| PUT | `/:id` | Admin | Update barber details |
| DELETE | `/:id` | Admin | Soft-deactivate a barber |

### Services (`/api/services`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | List all active services |
| GET | `/:id` | Public | Single service details |
| POST | `/` | Admin | Add new service |
| PUT | `/:id` | Admin | Update service |
| DELETE | `/:id` | Admin | Soft-deactivate service |

### Appointments (`/api/appointments`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | User | List own appointments |
| GET | `/all` | Admin | List all appointments (all users) |
| POST | `/` | User | Book new appointment (conflict-checked) |
| PUT | `/:id/cancel` | User | Cancel own appointment |
| PUT | `/:id/status` | Admin | Update appointment status |

### Server-Side Validation

The `/register` and `/login` routes use `express-validator` middleware:
- Username: minimum 3 characters, trimmed
- Name: minimum 2 characters, trimmed
- Email: valid format, normalised
- Password: minimum 6 characters

If validation fails, a `400` response is returned with a structured errors array before any database query is executed.

---

## 6. Database Design

The database (`barber_booking`) contains four tables with relationships enforced by foreign keys.

See `Documentation/ERD.md` for the full Entity Relationship Diagram.

### Tables Summary

| Table | Rows (seed) | Primary Key | Foreign Keys |
|---|---|---|---|
| users | 3 | `id` | — |
| barbers | 4 | `id` | — |
| services | 8 | `id` | — |
| appointments | 2 | `id` | `user_id`, `barber_id`, `service_id` |

### Key Design Decisions

- **Soft deletes**: Barbers and services are deactivated (`available = 0` / `active = 0`) rather than removed, preserving historical appointment data integrity.
- **Conflict checking**: Before inserting an appointment, the API queries for any existing non-cancelled appointment with the same barber, date, and time.
- **Cascade delete**: Deleting a user cascades to their appointments, preventing orphaned records.
- **Indexes**: Applied on all foreign key columns and frequently filtered columns (status, date, rating) for query performance.

---

## 7. Security Measures

| Concern | Implementation |
|---|---|
| Password storage | bcryptjs with 10 salt rounds — passwords never stored in plaintext |
| Authentication | JWT tokens with 7-day expiry; verified on every protected route |
| Authorisation | `isAdmin` middleware checks `role` claim in token before admin routes |
| Input validation | express-validator sanitises and validates all user inputs server-side |
| SQL injection | mysql2 parameterised queries (`?` placeholders) — no raw string interpolation |
| CORS | Explicitly configured for `http://localhost:5173` only |

---

## 8. Challenges and Solutions

### Challenge 1 — Database Migration
During development the project was initially built against Microsoft SQL Server Express. The module brief specifies MySQL, so the backend was fully migrated: the `mssql` package was replaced with `mysql2`, all parameterised query syntax was updated (`@param` → `?`), `sql.NVarChar`/`sql.Int` type bindings were removed, and the schema was rewritten from T-SQL to standard MySQL DDL.

### Challenge 2 — JWT Stateless Auth
Rather than using sessions (which require server-side storage), we chose JWT to keep the API stateless and scalable. The token carries the user's `id`, `role`, and `email` so the server never needs to hit the database just to identify the caller.

### Challenge 3 — Appointment Conflict Detection
To prevent double-booking the same barber at the same time, the API runs a pre-insert conflict check. Only slots where no existing non-cancelled appointment exists for that barber/date/time combination can be booked.

---

## 9. How to Run

### Prerequisites
- Node.js v18+
- MySQL 8 running locally

### Database Setup
```bash
mysql -u root -p < Database/schema.sql
```

### Backend
```bash
cd backend
npm install
# Edit .env: set DB_USER, DB_PASSWORD to match your MySQL setup
npm run dev
# → http://localhost:5000/api
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Default Admin Login
- **Username**: `admin`
- **Password**: `$barber@dbs`

---

## 10. Team Contributions

| Member | Responsibility |
|---|---|
| [Team Member 1] | Frontend — UI components, routing, theming |
| [Team Member 2] | Backend — REST API, authentication, middleware |
| [Team Member 3] | Database — schema design, seed data, ERD |
| [Team Member 4] | Testing — Postman collection, SQL verification tests |

---

*Document prepared for B8IT146 — Web Application Development, Dublin Business School, 2026.*
