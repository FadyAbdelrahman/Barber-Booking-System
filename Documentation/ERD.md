# Entity Relationship Diagram — Sharp Society Barber Booking System

## ERD (Text Notation)

```
┌──────────────────────────────┐
│            USERS             │
├──────────────────────────────┤
│ PK  id            INT        │
│     username      VARCHAR(50)│
│     name          VARCHAR(100│
│     email         VARCHAR(100│
│     password      VARCHAR(255│
│     phone         VARCHAR(20)│
│     role          ENUM       │  ← 'customer' | 'admin'
│     created_at    DATETIME   │
│     updated_at    DATETIME   │
└──────────────┬───────────────┘
               │ 1
               │ places
               │ N
               ▼
┌──────────────────────────────┐
│         APPOINTMENTS         │
├──────────────────────────────┤
│ PK  id               INT     │
│ FK  user_id           INT ───┼──→ USERS.id
│ FK  barber_id         INT ───┼──→ BARBERS.id
│ FK  service_id        INT ───┼──→ SERVICES.id
│     appointment_date  DATE   │
│     appointment_time  TIME   │
│     status            ENUM   │  ← pending|confirmed|completed|cancelled
│     notes             TEXT   │
│     created_at        DATETIME│
│     updated_at        DATETIME│
└──────────────────────────────┘
               ▲ N              ▲ N
               │ performs       │ used in
               │ 1              │ 1
┌──────────────┴───────────────┐  ┌──────────────────────────────┐
│           BARBERS            │  │           SERVICES           │
├──────────────────────────────┤  ├──────────────────────────────┤
│ PK  id               INT     │  │ PK  id           INT         │
│     name             VARCHAR │  │     name         VARCHAR(100)│
│     specialty        VARCHAR │  │     description  TEXT        │
│     experience_years INT     │  │     price        DECIMAL(10,2│
│     bio              TEXT    │  │     duration     INT (mins)  │
│     image_url        VARCHAR │  │     image_url    VARCHAR(255)│
│     rating           DECIMAL │  │     active       TINYINT(1)  │
│     available        TINYINT │  │     created_at   DATETIME    │
│     created_at       DATETIME│  │     updated_at   DATETIME    │
│     updated_at       DATETIME│  └──────────────────────────────┘
└──────────────────────────────┘
```

## Relationships

| Relationship | Cardinality | Description |
|---|---|---|
| USERS → APPOINTMENTS | 1 : N | One user can have many appointments |
| BARBERS → APPOINTMENTS | 1 : N | One barber can have many appointments |
| SERVICES → APPOINTMENTS | 1 : N | One service can be used in many appointments |

## Referential Integrity

All foreign keys are defined with `ON DELETE CASCADE`, meaning:
- Deleting a **user** automatically removes their appointments
- Deleting a **barber** automatically removes related appointments
- Deleting a **service** automatically removes related appointments

## Indexes

| Table | Index | Purpose |
|---|---|---|
| users | `uq_username`, `uq_email` | Unique constraint + fast login lookup |
| users | `idx_role` | Filter by admin/customer |
| barbers | `idx_available`, `idx_rating` | Filter active barbers, sort by rating |
| services | `idx_active`, `idx_price` | Filter active services, sort by price |
| appointments | `idx_user_id`, `idx_barber_id` | JOIN performance |
| appointments | `idx_appointment_date`, `idx_status` | Date-range queries, status filtering |
