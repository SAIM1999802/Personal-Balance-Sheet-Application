# 📊 Personal Balance Sheet Application

A full-stack financial transaction logger and balance sheet management web application built with **Node.js, Express, MySQL, HTML5, Bootstrap, and jQuery**. It includes secure JWT-based authentication, transaction tracking, database persistence, and Excel sheet import/export functionality.

---

> [!WARNING]
> ### 🚨 Security & Configuration Notice
> 1. **Generate Your Own JWT Secret:** Never commit your production `.env` file or use a weak secret. Generate a strong, unique `JWT_SECRET` key using `crypto` or a random string generator for your environment.
> 2. **Database Setup Required:** You must manually create the MySQL database and the required table schemas before starting the backend server. Reference table scripts are provided below.

---

## ✨ Features

- 🔐 **User Authentication:** Secure Signup and Signin with password hashing via `bcrypt` and session persistence via JSON Web Tokens (JWT).
- ⚡ **Zero-Flicker Route Protection:** Client-side inline authentication guards to prevent unauthorized page flicker before DOM rendering.
- 💰 **Transaction Logging:** Track incomes (Debit) and expenses (Credit) with dynamic balance recalculations in real time.
- 📁 **Excel Export & Import:** Powered by **SheetJS (`xlsx`)**, allowing users to export transaction tables directly to `.xlsx` files and bulk-import spreadsheet logs into the database.
- 🗄️ **Multi-User Data Separation:** Transactions are strictly scoped to the authenticated user ID (`user_id`).
- 🎨 **Responsive UI:** Clean, modern interface built with Bootstrap 5 and SweetAlert2 notifications.

---

## 🛠️ Tech Stack

### **Backend**
- **Node.js & Express.js** - REST API backend framework
- **MySQL2** - Database connector using connection pools
- **JSON Web Token (`jsonwebtoken`)** - Stateless authorization
- **Bcrypt** - Password hashing algorithm
- **Dotenv & CORS** - Environment management & Cross-Origin resource sharing

### **Frontend**
- **HTML5 & CSS3**
- **Bootstrap 5** - UI Layout & Responsiveness
- **jQuery (3.7.1)** - DOM manipulation and AJAX calls
- **SheetJS (`xlsx`)** - Spreadsheet parsing & generation
- **SweetAlert2** - Modern alert popups

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/installer/)

---

### 2. Database Configuration

1. Log into your MySQL server command-line or client (e.g., MySQL Workbench, phpMyAdmin).
2. Create a database named `balance_sheet_db` (or your preferred name):

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
