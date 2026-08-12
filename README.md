# 📊 Personal Balance Sheet Application

A full-stack financial transaction logger and balance sheet management web application built with **Node.js, Express, MySQL, HTML5, Bootstrap, and jQuery**. It includes secure JWT-based authentication, transaction tracking, database persistence, and Excel sheet import/export functionality.

---

> [!WARNING]
> ### 🚨 Security & System Setup Notice
> 1. **Generate Your Own JWT Secret:** Never commit your `.env` file or use a weak secret. Generate a strong, unique `JWT_SECRET` key using Node's `crypto` module or a random string generator for your environment.
> 2. **Manual Database Setup:** You must manually create the MySQL database and the required table schemas before starting the backend server. SQL setup scripts are provided below.
> 3. **Environment & Package Installation:** You must install Node.js and run `npm install` on your local environment to download all required backend dependencies.

---

## ✨ Features

- 🔐 **User Authentication:** Secure Signup and Signin with password hashing via `bcrypt` and session persistence via JSON Web Tokens (JWT).
- ⚡ **Zero-Flicker Route Protection:** Client-side inline authentication guards to prevent unauthorized page flicker before DOM rendering.
- 💰 **Transaction Logging:** Track incomes (Debit) and expenses (Credit) with dynamic balance recalculations in real time.
- 📁 **Excel Export & Import:** Powered by **SheetJS (`xlsx`)**, allowing users to export transaction tables directly to `.xlsx` files and bulk-import spreadsheet logs into the database.
- 🗄️ **Multi-User Data Separation:** Transactions are strictly scoped to the authenticated user ID (`user_id`).
- 🎨 **Responsive UI:** Clean, modern interface built with Bootstrap 5 and SweetAlert2 notifications.

---

## 🛠️ Tech Stack & Dependencies

### **Node.js & NPM Packages Required**
Make sure **Node.js (v14 or higher)** and **NPM** are installed on your machine.

The application relies on the following backend packages:
- 🚀 **`express`** - Fast, unopinionated web framework for Node.js.
- 🗄️ **`mysql2`** - MySQL client for Node.js with promise support and connection pooling.
- 🔑 **`jsonwebtoken`** - Generates and verifies JWTs for stateless user authorization.
- 🔒 **`bcrypt`** - Hashes user passwords securely using salt rounds.
- 🌐 **`cors`** - Enables Cross-Origin Resource Sharing for API requests.
- ⚙️ **`dotenv`** - Loads environment variables from a `.env` file into `process.env`.
- 🔄 **`nodemon`** *(Optional / Dev)* - Automatically restarts the server during development on file changes.

### **Frontend Tools**
- **HTML5 & CSS3**
- **Bootstrap 5** - UI Layout & Responsiveness
- **jQuery (3.7.1)** - DOM manipulation and AJAX calls
- **SheetJS (`xlsx`)** - Spreadsheet parsing & generation
- **SweetAlert2** - Modern popups and alerts

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed locally:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/installer/)

---

### 2. Database Configuration

1. Log into your MySQL server command line or client (e.g., MySQL Workbench, phpMyAdmin).
2. Create a database named `balance_sheet_db` and execute the following table schema:

```sql
CREATE DATABASE balance_sheet_db;
USE balance_sheet_db;

-- 1. Create Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Transactions Table
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    descriptions VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    balance DECIMAL(10, 2) NOT NULL,
    typess ENUM('debit', 'credit') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
