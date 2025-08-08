# 🛍️ Product Recommendation System

Welcome to the **Product Recommendation System** – a full-stack web application that allows users to post product-related queries and receive alternative product recommendations from other users. Built with the MERN stack, this platform encourages collaborative feedback and smart consumer choices.

### 🔗 Live Site
[🌐 Visit the Website](https://productrecommendationsite-nirob.netlify.app/)

---

## 🎯 Project Purpose

This project is developed as part of Assignment-11 to demonstrate skills in full-stack development using **React**, **Node.js**, **Express**, **MongoDB**, and **Firebase Authentication**. It evaluates a developer’s ability to implement real-world features like JWT authentication, private/public routing, CRUD operations, and responsive UI/UX with a strong focus on usability and design.

---

## 🚀 Key Features

### 🧑‍💻 User Authentication
- Email & Password login
- Google login
- Protected private routes using **JWT**

### 📄 Query System
- Add, update, and delete product-related queries
- View all queries in different grid layouts
- Query detail page with comments & recommendations

### 💡 Recommendation System
- Users can add recommendations to others' queries
- Delete own recommendations
- View recommendations made *by you* and *for you*

### 🔍 Search & Layout Toggle
- Search queries by product name
- Toggle between 1-column, 2-column, or 3-column layout

### 📱 Responsive Design
- Fully responsive layout for mobile, tablet, and desktop
- Clean and professional design with meaningful spacing and animations

### 🛡️ Security
- Firebase config & MongoDB credentials are stored using **environment variables**
- JWT authentication ensures route protection

### ⚙️ Deployment
- Client deployed on **Netlify**

---

## 📂 Pages Overview

| Route                      | Description                                              |
|---------------------------|----------------------------------------------------------|
| `/`                       | Home with slider, recent queries, and extra sections     |
| `/login` / `/register`    | Auth pages with error handling and social login          |
| `/queries`                | View all public queries                                  |
| `/my-queries`             | View/manage your own queries (Private)                   |
| `/add-query`              | Add a new query (Private)                                |
| `/query/:id`              | View query details, comments, and recommendations        |
| `/my-recommendations`     | View/delete your recommendations                         |
| `/recommendations-for-me`| View recommendations made on your own queries            |
| `*` (404)                 | Friendly not-found page with navigation button           |

---

## 🧰 NPM Packages Used

### 🔧 Development & Styling
- `vite`
- `tailwindcss`
- `daisyui`
- `bootstrap`
- `flowbite`
- `react-icons`
- `lottie-react`

### 🔄 React Core
- `react`
- `react-dom`
- `react-router`

### 🔐 Authentication
- `firebase`

### 🌐 HTTP Requests & Alerts
- `axios`
- `sweetalert2`

### 🧪 Linting & Plugins
- `eslint`
- `@vitejs/plugin-react`
- `@types/react`
- `@types/react-dom`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `@eslint/js`
- `globals`

---

## 📃 License

This project is submitted as part of a technical assignment and is intended for evaluation and educational purposes.

---

## 💬 Feedback

For suggestions or improvements, feel free to open an issue or contribute!

---