# Freight Company API - Project Documentation

## 1. Project Overview
The Freight Company API is a Node.js + TypeScript + Express + TypeORM REST API for managing a freight company's operations. 
It supports CRUD operations for Vehicles, Employees, Repairs, Shipments, and (upcoming) Trips, with PostgreSQL as the backend database.

---

## 2. Tech Stack
- Node.js (v18+)
- TypeScript
- Express.js
- TypeORM
- PostgreSQL
- Jest (unit & integration testing)
- Supertest (API endpoint testing)
- Postman (API exploration)

---

## 3. System Requirements
- Node.js 18 or newer
- npm 9 or newer
- PostgreSQL 14 or newer
- Postman (optional)

---

## 4. Setup Instructions

### Clone the repository
```bash
git clone <your-repo-url>
cd freight-company-api
```

### Install dependencies
```bash
npm install
```

### Create `.env` file
```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=freight_company
```

### Create the database
```bash
createdb -U <db_username> freight_company
```

---

## 5. Database Setup

### Run migrations
```bash
npx typeorm-ts-node-commonjs migration:run --dataSource src/database/data-source.ts
```

### Check status
```bash
npx typeorm-ts-node-commonjs migration:show --dataSource src/database/data-source.ts
```

### Revert last
```bash
npx typeorm-ts-node-commonjs migration:revert --dataSource src/database/data-source.ts
```

---

## 6. Running the API

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

API base URL:  
[http://localhost:4000](http://localhost:4000)

---

## 7. API Endpoints

### Health Check
```
GET /
```
Response:
```json
{"status":"ok","service":"Freight Company API"}
```

### Vehicles (`/vehicles`)
- GET, POST, PUT, PATCH, DELETE

### Employees (`/employees`)
- GET, POST, PUT, PATCH, DELETE

### Repairs (`/repairs`)
- GET, POST, PUT, PATCH, DELETE

### Shipments (`/shipments`)
- GET, POST, PUT, PATCH, DELETE

---

## 8. Request/Response Example - Create Shipment

**POST** `/shipments`
```json
{
  "customerId": 1,
  "weight": 800,
  "value": "2500.00",
  "origin": "Ottawa",
  "destination": "Calgary"
}
```

Response:
```json
{
  "customerId": 1,
  "weight": 800,
  "value": "2500.00",
  "origin": "Ottawa",
  "destination": "Calgary",
  "id": 4
}
```

---

## 9. Testing Guide

Run all tests:
```bash
npm test
```

Run only unit tests:
```bash
npm test -- unit
```

Run only integration tests:
```bash
npm test -- integration
```

---

## 10. Postman Usage

1. Import:
   - `Freight-Shipments.postman_collection.json`
   - `Freight-Local.postman_environment.json`
2. Set environment variables:
   - `baseUrl` = `http://localhost:4000`
   - `customerId` = valid ID from `customers` table
3. Run requests in order.

---

## 11. Development Tips

Create migration:
```bash
npx typeorm migration:create src/migrations/NameOfMigration
```

View executed migrations:
```bash
npx typeorm-ts-node-commonjs migration:show --dataSource src/database/data-source.ts
```

---

## 12. Future Enhancements
- Add authentication and role-based access
- Implement advanced search and filtering
- Add Swagger API documentation

---

Thank You. 

Author & Licensed by
Yash Shah
yashshah0704@gmail.com
