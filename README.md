# 📚 Book Management API

A RESTful API for managing **Books** and **Categories** built with **Node.js, Express, TypeScript, Prisma, PostgreSQL, and Zod validation**.

---

## 🚀 Features

* CRUD operations for Books and Categories
* Relational database design (Book belongs to Category)
* Request validation using Zod
* Global error handling
* Swagger API Documentation
* Unit testing with Jest

---

## 🛠 Tech Stack

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* Zod
* Swagger (OpenAPI)
* Jest

---

## ⚙️ Setup & Installation

### 1️⃣ Clone Repository

```
git clone <[your-repo-url](https://github.com/yara-e/Book_Managment)>
cd Book_Management
```

### 2️⃣ Install Dependencies

```
npm install
```

### 3️⃣ Create `.env`

```
DATABASE_URL=your_postgres_connection_string
PORT=8000
```

### 4️⃣ Run Migrations

```
npx prisma migrate dev
```

### 5️⃣ Generate Prisma Client

```
npx prisma generate
```

### 6️⃣ Run Server

```
npm run dev
```

Server runs at:

```
http://localhost:8000
```

---

## 📖 API Documentation

Swagger UI:

```
http://localhost:8000/api-docs
```

Swagger JSON:

```
http://localhost:8000/api-docs.json
```

---

## 📚 Main Endpoints

### Categories

* `GET /category`
* `GET /category/:id`
* `POST /category`
* `PUT /category/:id`
* `DELETE /category/:id`

---

### Books

* `GET /book`
* `GET /book/:id` (includes category)
* `POST /book`
* `PUT /book/:id`
* `DELETE /book/:id`

---

## 🧪 Run Tests

```
npm test
```

Tests cover service layer business logic for Books and Categories.

---

## 🔐 Business Rules

* Book must belong to existing category
* Category cannot be deleted if it contains books
* All inputs are validated before database operations

---
