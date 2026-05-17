# 🕴️ Karma - Developer Handbook & Technical Deep Dive

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

## 🏗️ 2. Architectural Deep Dives: How Things Work

### A. The Authentication Flow (How Login Works)
Understanding authentication is critical for any full-stack developer. We use **HTTP-Only Cookies**, which is the gold standard for web security.

**The Traditional Login Flow:**
1. User types email and password on the React frontend.
2. React sends a `POST` request to `/api/auth/login`.
3. Express looks up the user in MongoDB.
4. Express uses `bcrypt.compare()` to check if the password matches the hash.
5. If valid, Express signs a **JWT (JSON Web Token)**.
6. **Security Magic:** Instead of sending the token back as JSON (where React would have to save it in LocalStorage—which is vulnerable to Cross-Site Scripting / XSS attacks), Express attaches the JWT to an **HTTP-Only Cookie**.
7. The browser automatically saves this cookie. For all future API requests, the browser automatically attaches this cookie, proving the user is logged in.

**The Google OAuth Flow:**
1. User clicks "Login with Google".
2. React redirects the user to our backend route `/api/auth/google`.
3. Passport.js redirects the user to Google's consent screen.
4. Google redirects back to our backend with the user's profile info.
5. We check if the user exists in MongoDB. If not, we create an account for them.
6. We generate the JWT, attach it to the HTTP-Only cookie, and redirect the user back to the React dashboard.

### B. The File Upload Pipeline (How Images are Saved)
Handling images efficiently separates junior developers from mid-level/senior developers. You **never** want to save user-uploaded images directly onto your backend server's hard drive because it doesn't scale.

1. **Frontend:** User selects 4 images in the "Edit Product" React form and hits submit. React packages these files into a `FormData` object and sends them to the backend.
2. **Backend (Multer):** The request hits an Express route guarded by the `multer` middleware. Multer reads the incoming files and buffers them in **RAM (Memory Storage)** rather than saving them to the server's disk.
3. **Backend (ImageKit):** Our Express controller takes those memory buffers and streams them directly via API to **ImageKit.io**.
4. **Cloud:** ImageKit receives the files, stores them on global edge servers, and returns a fast, optimized public URL (e.g., `https://ik.imagekit.io/karma/shirt1.jpg`).
5. **Database:** Express takes those new URLs and saves them into the MongoDB Product document. It responds to React with "Success!".

### C. The Shopping Cart System (State Management & Logic)
The cart is the heart of an e-commerce app. It requires precise synchronization between the database and the global UI state.

1. **Price Snapshotting:** When an item is added to the cart, we save the **current price** inside the cart document. 
   * **Why?** This prevents "price shock" where a user adds an item at $50, the seller changes it to $70, and the user's cart total changes without notice. It locks in the price at the time of the "Add to Cart" intent.
2. **Variant Support:** Our cart doesn't just track products; it tracks specific **variants** (Size, Color, etc.). We use Mongoose's `$inc` operator to efficiently increase quantity if the same product-variant combination is already in the cart.
3. **Optimistic UI vs. State Sync:** We use Redux Toolkit to manage the cart globally. When a user adds an item, we perform the API call and update the Redux store. This ensures the cart count (badge) and the cart page stay perfectly in sync across different components.
4. **Authentication Gate:** The cart is protected by an `authMiddleware`. If a guest user tries to add to cart, the frontend intercepts the 401 error and redirects them to the login page, preserving their intent to shop.

---

## 🛒 2.1 Deep Dive: The Shopping Cart Architecture & Aggregation (Interview Ready)
To build a bulletproof production shopping cart, we designed a unified data model, high-performance API endpoints, and a multi-collection MongoDB aggregation system.

### 🗄️ 1. Conceptual Database Model (`cart.model.js`)
Rather than keeping cart data in client-side LocalStorage (which disappears across devices and blocks marketing triggers like abandoned cart recovery emails), the Cart is saved directly on the backend database matching a:
* **One-to-One Owner Relationship**: Links a specific authenticated `User` account to exactly one parent `Cart` document.
* **Granular Items Array**: An embedded list of products inside the cart. Each item specifies:
  - **Product Reference**: A clean link pointing back to the Product Catalog.
  - **Variant ID**: A specialized identifier linking directly to the specific size or color variant.
  - **Quantity**: The designated quantity count.
  - **Snapshotted Base Price**: The historical price locked in at the exact moment of addition, keeping the cost stable even if the seller edits catalog details.

### 🔌 2. Backend API Architecture (`cart.routes.js`)
The database handles updates through five core endpoints protected by secure user session validation:
* `POST /api/cart/add/:productId/:variantId` - Validates inventory and registers the item/variant.
* `GET /api/cart` - Triggers the Aggregation Pipeline to populate catalog and user data.
* `PATCH /api/cart/quantity/increment/:productId/:variantId` - Atomically increments cart counts.
* `PATCH /api/cart/quantity/decrement/:productId/:variantId` - Atomically decrements cart counts, removing the item if it hits zero.
* `DELETE /api/cart/remove/:productId/:variantId` - Safely pulls the variant array item out of the cart.

### 📊 3. The Multi-Collection Aggregation Pipeline (`cart.dao.js`)
To render the detailed shopping cart page, our application must combine data from three separate sources: **User data** (session identification), **Cart data** (quantities and selections), and **Product Catalog data** (images, titles, and variant descriptions).

Instead of running multiple separate database queries (which creates massive performance bottlenecks and increases server response latency), we engineered a **single, highly-efficient MongoDB Aggregation Pipeline** that joins the Cart, User, and Product collections and calculates totals in one roundtrip:

1. **`$match`**: Filters the initial database query by the active user's ID to fetch only their specific cart document.
2. **`$unwind` (Items Array)**: Deconstructs the items array into separate flat documents so that each individual product-variant selection can be matched, joined, and priced independently.
3. **`$lookup` (Product Join)**: Performs a database join between our cart item's product reference and the `products` collection, populating full product metadata (images, brand, description).
4. **`$unwind` (Product & Embedded Variants)**: Flattens the retrieved product details and its internal `variants` array so we can query specific catalog attributes.
5. **`$match` (Variant Comparison)**: Evaluates dynamic comparisons between the selected cart item's `variant` ID and the product's embedded variant ID, ensuring we extract **only** the size/color combination the user actively selected.
6. **`$addFields` (Dynamic Line Sums)**: Dynamically multiplies item quantity by variant price (`quantity * variant.price.amount`) on the database side, creating a live line subtotal.
7. **`$group` (Reconstruct & Rollup)**: Groups all flattened documents back together by the Cart ID, calculating the grand `totalPrice` sum, choosing the primary `currency` denomination, and pushing all matching product-variant details back into a clean, unified `items` array.

This pipeline offloads heavy calculations and relationships directly to MongoDB's highly optimized engine, keeping our Node.js memory footprint extremely lightweight and responding to the frontend instantly!

### 🧠 4. Advanced Controller Operations (`cart.controller.js`)
Our cart controllers prioritize data integrity and prevent race conditions:
* **Embedded Stock Verification**: Before adding items, our controller fetches the embedded variant from the catalog, checks its `stock` value, and rejects the addition with an HTTP 400 if the cart exceeds current physical warehouse inventory.
* **Concurrency Protection (Atomic Operations)**: Instead of reading, modifying, and saving the full array in JavaScript, we use MongoDB atomic operators like `$inc` and positional operators (`items.$.quantity`) to increment/decrement counts inside a single query.
* **Atomic Pruning**: Removing items completely is performed in a single database instruction using the `$pull` operator.

### ⚛️ 5. Frontend State Pipeline (`cart.slice.js`)
Global cart synchronization is managed via **Redux Toolkit (RTK)** to handle badge totals and optimistic updates:
* **Initial State**: Manages items, grand subtotals, and core currency.
* **Core Reducers**:
  - `setCart`: Populates the populated items and subtotals retrieved from the aggregation payload.
  - `incrementCartItem` & `decrementCartItem`: Instantly alters local counts, allowing the UI to remain snappy (optimistic rendering).
  - `removeCartItem`: Filters out the matching variant immediately on checkout panels.

---

## 🛠️ 2.2 Advanced DevOps & Authentication (Our Latest Upgrades)
During the latest release, we solved real-world mobile debugging challenges and created an elite streetwear diagnostic interface.

### A. Dynamic Google OAuth Host IP Preservation
* **The Problem**: When developers test e-commerce sites on actual mobile phones, they connect via the local network IP (e.g. `http://192.168.1.15:5173`). However, our backend Google callback had a hardcoded redirect target to `http://localhost:5173/`. Once mobile users gave Google permission, the backend redirected their phone's browser to `localhost`, which crashed with a "connection refused" error because the Vite server wasn't running inside the phone itself.
* **The Solution**: 
  1. We modified the `/api/auth/google` route handler to extract the original calling frontend origin dynamically from the request's `Referer` header.
  2. We passed this origin URL into Google OAuth 2.0 via the official `state` parameter:
     `passport.authenticate("google", { scope: ["profile", "email"], state: origin })`
  3. Google authenticates the request and passes the `state` parameter back to our `/google/callback` URL unchanged.
  4. Our backend callback reads `req.query.state` and dynamically redirects both successes and failures back to the correct calling host (e.g., `http://192.168.1.15:5173/` or a custom production domain), fully fixing mobile Google logins!

### B. Mobile Navigation Escapes
* **The Problem**: Mobile users landing on `/login` or `/register` were stuck with no visible option to exit the auth screens and return to the main store catalog without using their browser's back button.
* **The Solution**: We implemented a highly visible, absolute positioned **"← Back to Shop"** button at the top-left of both screens (`top-6 left-6 z-20`). Styled with modern borders, typography, and a hover micro-animation that slides the arrow, it gives guest shoppers a seamless return route.

### C. Catch-All Diagnostic Page (404 / 503 Service Offline)
We built an extremely premium catch-all route mapped to `*` in the React Router definitions, serving as both a 404 handler and an active system health dashboard:
* **Off-White Industrial Style**: Designed with a deep black backdrop, a digital grid layout, neon-red blinking beacons, and large outlined numbers with a solid "OFFLINE" running overlay.
* **Active Connection Health Check**: Features a terminal console running mock diagnostics, and a **"Retry Connection"** button that pings the backend `/api`. If the server is offline, it informs the user the gateway is down and asks them to check back in an hour. If the backend responds, it reports a successful handshake and auto-redirects them back to the shop catalog!

---

## 🎤 3. Interview Cheat Sheet: The "Why" Behind The Code

If an interviewer asks you about this project, they don't just want to know *what* you built; they want to know *why* you made specific technical decisions. Use these answers to demonstrate deep understanding.

**Q: "Why did you choose MongoDB over a SQL database like PostgreSQL?"**
> **Answer:** "For an e-commerce platform like Karma, product catalogs can be highly variable. A shirt might have sizes and colors, while an accessory might have entirely different attributes. MongoDB's schema-less document structure allowed me to rapidly iterate on the Product schema without dealing with complex SQL migrations or rigid table joins. It maps perfectly to JavaScript objects in my Node/Express backend."

**Q: "How did you secure user sessions in your app?"**
> **Answer:** "I avoided using LocalStorage for session tokens because it exposes the application to XSS (Cross-Site Scripting) attacks—any malicious script could read the token. Instead, I implemented JWTs stored inside **HTTP-Only, Secure cookies**. This means the token is handled entirely by the browser and cannot be accessed via JavaScript on the client side, significantly increasing the security posture of the authentication flow."

**Q: "How did you handle the performance of loading high-quality fashion images?"**
> **Answer:** "Serving large images directly from my Express server would bottleneck the application and increase hosting costs. I implemented a cloud architecture using **ImageKit** as a CDN. I used **Multer** in memory-storage mode to intercept uploads and pipe them directly to ImageKit. This not only offloaded the storage burden from my server but also ensured images are served globally with automatic format optimization (like WebP), resulting in a much faster, premium UI experience."

**Q: "Why did you use Redux Toolkit for state management?"**
> **Answer:** "Initially, I could have used React's Context API, but as the app grew—managing user authentication state, complex seller dashboards, and product edits—Context API would cause unnecessary re-renders across the application tree. Redux Toolkit allowed me to create strict, predictable state slices. It decoupled my data fetching and global state from my UI components, making the codebase much cleaner and easier to debug."

**Q: "How did you implement the 'Add to Cart' functionality to be robust?"**
> **Answer:** "I implemented a two-tier validation system. On the frontend, I use a custom `useCart` hook to manage loading states and provide immediate feedback. On the backend, I used `express-validator` to ensure product IDs and quantities are valid. Crucially, I implemented **price snapshotting** within the Cart schema, so the price the user sees when they add an item is preserved even if the seller updates the product price later."

**Q: "How did you manage the UI design without using a component library like Material-UI?"**
> **Answer:** "I wanted a unique, premium 'editorial' streetwear aesthetic that didn't look like a standard dashboard template. I chose **Tailwind CSS v4** because its utility-first approach allowed me to build a highly custom design system directly in my components. It gave me granular control over layout, typography, and dark-theme colors, resulting in a bespoke interface while keeping the final CSS bundle size incredibly small."

**Q: "How did you implement variant stock protection in your cart?"**
> **Answer:** "We store individual item variants (Size, Color, etc.) inside the product document. When a user adds an item or increases its quantity in the cart, the backend doesn't just check basic product existence; it retrieves the exact embedded variant ID from MongoDB, reads its specific stock count, and compares it against the user's current cart quantity. If they exceed the stock, we reject it at the controller level with an HTTP 400. This ensures we never sell products we don't physically have in stock."

**Q: "What are atomic updates and how did you use them in the Cart?"**
> **Answer:** "In a high-traffic app, if two processes try to update a document at the same time, they can overwrite each other's changes. To avoid this, I used **atomic operations** on MongoDB instead of pulling the cart array into Javascript, editing it, and sending it back. By using MongoDB's `$inc` operator for incrementing/decrementing quantities and `$pull` for removing items directly inside a single `findOneAndUpdate` query, I bypassed database race conditions completely, ensuring bulletproof data concurrency."

**Q: "Explain how you solved the Cart Page data requirements. How did you join Cart, User, and Product details?"**
> **Answer:** "To display the cart page, we need information scattered across User, Cart, and Product catalogs. I designed a multi-stage **MongoDB Aggregation Pipeline** rather than doing standard population or running multiple queries. I use `$match` to target the user's cart, `$unwind` to split individual items, `$lookup` to join with the products collection, and `$unwind` to flatten variants. We then run a dynamic variant matching comparison, calculate line subtotals via `$addFields`, and finally `$group` items back together while summing up the subtotal into a grand `totalPrice` sum. This runs entirely in the database engine in a single database trip, maximizing performance."

**Q: "How did you solve the Google OAuth redirect issue when debugging on physical mobile phones?"**
> **Answer:** "In a local dev environment, our mobile devices connect via local network IP addresses, but Google OAuth callbacks redirect back to the server, which hardcoded a redirect target to `localhost:5173`. Because Vite doesn't run on the phone, the phone would crash. To solve this, I designed a dynamic OAuth pipeline: the backend captures the original host origin from the HTTP `Referer` header at start, stores it inside Google's OAuth `state` parameter, and on successful callback, extracts this dynamic host IP to redirect the user back to their starting device IP. This completely solved the localhost connection issue on mobile!"

**Q: "How did you build the connection check diagnostics in your custom 404 page?"**
> **Answer:** "I designed the catch-all `*` route to render a custom status page that checks the system's heartbeat. If the user encounters a route error or backend down error, the component pings the backend `/api` root. If it detects a 200 OK response, it alerts the user that the system connection is restored and triggers a React Router redirect back to the home page automatically, while showing full terminal diagnostic readouts to the user if the server remains offline."

---

## 📂 4. Project Structure Overview

### `/backend`
* `server.js` - The main entry point. Sets up Express, connects to MongoDB, and registers routes.
* `/models` - Mongoose schemas. e.g., `User.js`, `Product.js`, `Cart.js`.
* `/controllers` - The business logic. (e.g., `cart.controller.js` handles adding/removing items).
* `/routes` - Maps URL endpoints to specific controllers.
* `/middleware` - Functions that run *before* the controller (e.g., `authMiddleware` for security).

### `/frontend`
* `src/main.jsx` - The React entry point. Wraps the app in Redux Providers and React Router.
* `src/features/` - Feature-based architecture:
    * `features/auth/` (Authentication state & UI).
    * `features/products/` (Catalog management).
    * `features/cart/` (Shopping cart logic, Redux slice, and UI).
* `src/store/` - The central Redux configuration.

---

## 🚀 5. Quick Start (Running Locally)

1. **Open two terminal windows.**
2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Access the app at `http://localhost:5173`.
