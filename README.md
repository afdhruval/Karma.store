# 🕴️ Karma - Shopping Store

![Karma Banner](https://ik.imagekit.io/onf7ynga4s/Screenshot%202026-05-17%20140422.png)

Welcome to the ultimate technical guide for **Karma** (formerly Snitch), a premium full-stack fashion e-commerce marketplace. 

This document is designed not just as a standard README, but as a **comprehensive learning resource**. If you are preparing for an interview or need to understand exactly how this application works under the hood, read this document carefully. It explains every technology used, why it was chosen, and how the different pieces of the architecture talk to each other.

---

## 📚 1. Core Technologies: What We Used and WHY

### 🎨 Frontend (The User Interface)
The frontend is responsible for everything the user sees and interacts with. It needs to be fast, responsive, and beautiful.

* **React (v19):** The core library used to build the user interface using reusable components. React uses a Virtual DOM to efficiently update the UI without reloading the page.
* **Vite:** Our build tool and development server. **Why not Create React App (CRA)?** Vite is significantly faster than CRA because it leverages native ES modules in the browser, making server start times and hot-module replacement (HMR) nearly instant.
* **Redux Toolkit (RTK):** Used for Global State Management. **Why Redux?** While React has Context API, Redux is better for complex applications with lots of moving parts (like a shopping cart, user sessions, and product lists) because it prevents unnecessary re-renders and provides a centralized "store" of data.
* **Tailwind CSS (v4):** A utility-first CSS framework. **Why Tailwind?** Instead of writing thousands of lines of custom CSS, Tailwind allows us to style components directly in the HTML/JSX. We used it to build a highly custom, dark-themed, premium editorial aesthetic without relying on cookie-cutter component libraries like Bootstrap.
* **React Router DOM:** Handles navigation. It allows us to create a Single Page Application (SPA) where clicking a link swaps out the components instantly without sending a request to the server to load a new HTML page.

### ⚙️ Backend (The Server & API)
The backend handles the business logic, database connections, and security.

* **Node.js & Express.js (v5):** Node allows us to run JavaScript on the server. Express is a lightweight framework built on top of Node that makes it incredibly easy to create RESTful API routes (e.g., `GET /api/products`).
* **MongoDB & Mongoose:** Our database layer. MongoDB is a NoSQL database, meaning it stores data in flexible, JSON-like documents rather than strict tables. Mongoose is an Object Data Modeling (ODM) library that allows us to define strict schemas (rules) for our data (e.g., ensuring a User document always has an email).
* **Passport.js & Google OAuth 2.0:** Middleware for authentication. We use Passport to abstract away the complex logic of communicating with Google's servers to verify a user's identity when they click "Login with Google".
* **JSON Web Tokens (JWT):** The standard for securely transmitting information between the client and server. When a user logs in, we give them a JWT as an "entry pass".
* **Bcrypt.js:** A cryptography library. **Crucial Security Concept:** We NEVER save plain text passwords in the database. Bcrypt "hashes" the password into a scrambled string, making it impossible for hackers to steal passwords even if the database is breached.

### ☁️ Cloud & File Management
* **ImageKit.io:** A cloud-based Image CDN (Content Delivery Network).
* **Multer:** A Node.js middleware for handling file uploads (`multipart/form-data`).

---
