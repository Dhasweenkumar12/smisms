# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# SMISMS — Smart Inventory Management System

A full-stack inventory management app with authentication, role-based access, search, filtering, and a live dashboard.

## Tech Stack
- **Backend:** FastAPI, PostgreSQL, SQLAlchemy, JWT auth (passlib + python-jose)
- **Frontend:** React (Vite), Tailwind CSS, Axios

## Features
- Product CRUD (Create, Read, Update, Delete) with inline editing
- User signup/login with hashed passwords (bcrypt) and JWT tokens
- Role-based authorization — Admin vs Staff (only Admins can delete products)
- Live search and category filtering (backend-driven)
- Dashboard with real-time stats (total products, inventory value, low stock)
- Low Stock page
- Sidebar navigation

## Setup

### Backend