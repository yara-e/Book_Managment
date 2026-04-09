# 📚 The Digital Shelf - Bookstore

A Scalable E-commerce backend built with **Node.js**, **TypeScript**, and **Prisma**. This project demonstrates backend patterns including bidirectional cursor pagination, Redis-powered caching, secure Stripe payments, and database transactions.

---

## 🚀 Key Features

### 🛒 E-Commerce & Payments
* **Stripe Integration:** Secure checkout flow using Stripe Hosted Sessions.
* **Inventory Management:** Automatic stock validation before checkout and atomic stock decrement after successful payment using **Prisma Transactions**.
* **Order Tracking:** Robust state management for `PENDING`, `PAID`, and `CANCELLED` statuses.

### ⚡ Performance & Scalability
* **Upstash Redis Caching:**
    * **Cache-Aside Pattern:** Optimized for high-traffic "Best Seller" book details.
    * **Dynamic List Caching:** Unique cache keys generated based on category, search, and pagination parameters.
    * **Invalidation:** Automatic cache purging during Create, Update, and Delete operations to prevent stale data.
* **Cursor Pagination:** Efficient database queries for Books and Admin Orders, allowing seamless "Next" and "Previous" navigation.
* **Rate Limiting:** IP-based protection using Upstash Redis sliding window algorithm to prevent API abuse and brute-force attacks.

### 🛡️ Security & Architecture
* **RBAC (Role-Based Access Control):** Secure route protection for `USER` and `ADMIN` roles.
* **Global Error Handling:** Centralized middleware for consistent, professional API error responses.
* **Clean Architecture:** Strict separation of concerns between Controllers, Services, and Repositories.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Language:** TypeScript
* **Framework:** Express.js
* **Database:** PostgreSQL (Supabase)
* **ORM:** Prisma
* **Cache/Rate Limit:** Upstash Redis
* **Payments:** Stripe API
* **File Storage:** Cloudflare R2
* **Environment:** Cross-platform (Windows/Linux/Mac)

