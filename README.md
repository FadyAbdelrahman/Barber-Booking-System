# 💈 Barber Booking System — CA Assignment

> **Module:** B8IT146 — Web and Cloud Application Development
> 
> **Institution:** Dublin Business School
> 
> **Assessment:** CA — Full-Stack Web Application
> **Submission Date:** 12th April 2026
> 
> **Academic Year:** 2025/2026
> 
> **Lecturer:** Dr. Basel Magableh

---

## 👥 Group Members

| Name | Student ID |
|------|-----------|
| Rodrigo Xavier Ramos | 20059753 |
| Fady Abdelrahman Mohamed | 20053593 |

---

## 📋 Project Overview

This project is a full-stack web application that modernises the appointment booking process for barbershops. Built under the **"Sharp Society"** brand, the system replaces traditional phone-based scheduling with a smooth, responsive digital experience — allowing customers to browse services, choose a barber, and confirm a time slot in under a minute.

**Key Achievements:**

- ✅ Full-stack application with React 18 frontend + Node.js/Express backend
- ✅ MySQL relational database with 4 normalised tables and foreign key constraints
- ✅ JWT authentication system with bcrypt password hashing
- ✅ 15+ RESTful API endpoints with full CRUD operations
- ✅ Admin panel for managing barbers, services, and appointments
- ✅ Fully responsive UI across desktop, tablet, and mobile
- ✅ End-to-end tested with Postman

---

## 🏗️ Architecture

```text
[Browser / Client]
       ↓
[React 18 + Vite — http://localhost:5173]
       ↓ HTTP / REST API (Axios)
[Node.js + Express Server — http://localhost:5000]
├── Auth Routes      (/api/auth/*)
├── Barber Routes    (/api/barbers/*)
├── Service Routes   (/api/services/*)
└── Appointment Routes (/api/appointments/*)
       ↓ SQL Queries (MySQL2)
[MySQL 8.0 Database]
├── users
├── barbers
├── services
└── appointments
```

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2.0 | UI Framework |
| React Router DOM | 6.20.1 | Client-side Routing |
| Vite | 5.0.8 | Build Tool |
| Bootstrap 5 | 5.3.2 | UI Components & Styling |
| React Bootstrap | 2.9.1 | React Bootstrap Components |
| Axios | 1.6.2 | HTTP Client |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime Environment |
| Express.js | 4.18.2 | Web Framework |
| MySQL2 | 3.6.5 | Database Driver |
| bcryptjs | 2.4.3 | Password Hashing |
| jsonwebtoken | 9.0.2 | JWT Authentication |
| express-validator | 7.0.1 | Input Validation |
| dotenv | 16.3.1 | Environment Variables |
| cors | 2.8.5 | Cross-Origin Resource Sharing |

---

## 🗄️ Database Design

4 tables with proper relational structure:

```
users ──────────────────────────────────┐
  id, name, email, password,            │
  phone, role, created_at               │
                                        ▼
barbers ────────────────────► appointments ◄──── services
  id, name, specialty,          id, user_id,       id, name,
  experience_years, bio,        barber_id,         description,
  image_url, rating,            service_id,        price, duration,
  available                     date, time,        image_url, active
                                status, notes
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get JWT token |

### Services
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/services` | Public | Get all active services |
| GET | `/api/services/:id` | Public | Get service by ID |
| POST | `/api/services` | Admin | Create new service |
| PUT | `/api/services/:id` | Admin | Update service |
| DELETE | `/api/services/:id` | Admin | Soft delete service |

### Barbers
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/barbers` | Public | Get all available barbers |
| GET | `/api/barbers/:id` | Public | Get barber by ID |
| POST | `/api/barbers` | Admin | Create new barber |
| PUT | `/api/barbers/:id` | Admin | Update barber |
| DELETE | `/api/barbers/:id` | Admin | Soft delete barber |

### Appointments
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/appointments` | Private | Get user's appointments |
| POST | `/api/appointments` | Private | Book appointment |
| PUT | `/api/appointments/:id/cancel` | Private | Cancel appointment |

---

## 🚀 Installation Guide

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=barber_booking_system
JWT_SECRET=your_secret_key
```

Then run:

```bash
mysql -u root -p < ../database/schema.sql
npm run dev
```

> Server runs at **http://localhost:5000**

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> App runs at **http://localhost:5173**

---

## 🧪 Testing

API endpoints were tested using **Postman**. Key test cases:

| # | Test | Method | Endpoint | Expected |
|---|------|--------|----------|----------|
| 1 | Register user | POST | `/api/auth/register` | 201 Created + JWT |
| 2 | Login user | POST | `/api/auth/login` | 200 OK + JWT |
| 3 | Get all barbers | GET | `/api/barbers` | 200 OK + array |
| 4 | Book appointment | POST | `/api/appointments` | 201 Created |
| 5 | Get my appointments | GET | `/api/appointments` | 200 OK + data |
| 6 | Cancel appointment | PUT | `/api/appointments/:id/cancel` | 200 OK |
| 7 | Health check | GET | `/api/health` | 200 OK |

For protected routes, include the header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📂 Project Structure

```
barber-booking-system/
├── frontend/
│   ├── src/
│   │   ├── pages/          # Home, Login, Register, Services,
│   │   │                   # Barbers, Book, MyAppointments, Dashboard
│   │   ├── components/     # Navbar, Footer, LoadingSpinner
│   │   ├── context/        # AuthContext
│   │   └── utils/          # api.js (Axios config)
│   └── package.json
├── backend/
│   ├── routes/             # auth, services, barbers, appointments
│   ├── middleware/         # auth.js, validation.js
│   ├── config/             # db.js
│   └── package.json
├── database/
│   └── schema.sql
└── README.md
```

---

## 👤 Team Contributions

| Member | Student ID | Role | Contribution |
|--------|-----------|------|-------------|
| Fady Abdelrahman Mohamed | 20053593 | Backend Lead & Database Architect | 50% |
| Rodrigo Xavier Ramos | 20059753 | Frontend Lead & Integration Developer | 50% |

**Fady** — Database schema design, all 4 MySQL tables, 15+ API endpoints, JWT auth, bcrypt hashing, CRUD operations, Postman testing.

**Rodrigo** — React + Vite setup, all 8 frontend pages, shared components (Navbar, Footer), AuthContext, full API integration, responsive design.

**Both** — Final end-to-end testing, report writing, oral defence preparation.

---

## 🔮 Future Enhancements

- [ ] Email notifications (appointment confirmations & reminders)
- [ ] Online payment integration
- [ ] Customer reviews and barber ratings
- [ ] Recurring appointments and waitlist
- [ ] React Native mobile application
- [ ] Multi-location barbershop support
- [ ] Advanced analytics dashboard

---

## 📚 References

1. F. Abdelrahman and R. Xavier Ramos, "Barber Booking System," GitHub, 2026. [Online]. Available: https://github.com/FadyAbdelrahman/Barber-Booking-System
2. PlantUML, "PlantUML Online Editor." [Online]. Available: https://editor.plantuml.com/
3. Meta Open Source, "React Documentation." [Online]. Available: https://react.dev/
4. OpenJS Foundation, "Node.js Documentation." [Online]. Available: https://nodejs.org/en/docs
5. StrongLoop Inc., "Express.js." [Online]. Available: https://expressjs.com/
6. Oracle Corporation, "MySQL 8.0 Reference Manual." [Online]. Available: https://dev.mysql.com/doc/refman/8.0/en/
7. Auth0 by Okta, "Introduction to JSON Web Tokens." [Online]. Available: https://jwt.io/introduction
8. The Bootstrap Team, "Bootstrap 5 Documentation." [Online]. Available: https://getbootstrap.com/docs/5.3/
9. Postman Inc., "Postman API Platform Documentation." [Online]. Available: https://learning.postman.com/docs/
10. Vitejs Team, "Vite — Next Generation Frontend Tooling." [Online]. Available: https://vitejs.dev/

---

*Dublin Business School — Academic Year 2025/2026*
