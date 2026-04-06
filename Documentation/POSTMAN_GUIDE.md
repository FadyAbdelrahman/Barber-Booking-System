# Postman Collection Guide

## Import Instructions

1. Open Postman
2. Click "Import" button
3. Drag and drop `Barber_Booking_API.postman_collection.json`
4. Collection will appear in sidebar

## Running Tests

### Public Endpoints (No Authentication)
1. Health Check
2. Get Services
3. Get Barbers

### Authentication
1. **Register User** - Creates new user, returns token
2. **Login** - Login existing user, returns token

### Protected Endpoints (Require Token)
1. **Create Appointment** - Add token in Authorization tab
2. **Get My Appointments** - Add token in Authorization tab

## How to Use Token

1. Run Login request
2. Copy token from response
3. In protected requests:
   - Go to Authorization tab
   - Type: Bearer Token
   - Paste token

## Test Accounts

| Username  | Password    | Role     |
|-----------|-------------|----------|
| admin     | $barber@dbs | admin    |
| testadmin | admin123    | admin    |
| fady.1    | customer123 | customer |

## Server Configuration

- Base URL: `http://localhost:5000`
- API Prefix: `/api`
- Default Port: `5000`

## Troubleshooting

### 401 Unauthorized
- Token expired or invalid
- Re-login to get new token

### 404 Not Found
- Check server is running: `node server.js`
- Verify URL spelling

### 500 Server Error
- Check database connection
- Check server logs in terminal