# 🛍️ TheBrand - Premium E-Commerce Platform

A high-performance, type-safe, and scalable e-commerce solution built with a senior-level architecture. **TheBrand** leverages a modern tech stack and strict engineering principles to provide a seamless shopping experience for clients and a robust management interface for administrators.

---

## 🚀 Tech Stack

### **Languages & Core**
- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) **TypeScript** (Strict Mode)
- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) **Node.js** (v18+)

### **Frontend (Presentation Layer)**
- ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) **React.js**
- ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) **Vite** (Build Tool)
- ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) **Vanilla CSS** (Custom Design System)
- ![Axios](https://img.shields.io/badge/axios-671ddf?style=for-the-badge&logo=axios&logoColor=white) **Axios** (API Requests)

### **Backend (Business & Persistence Layer)**
- ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) **Express.js** 
- ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) **Prisma ORM**
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) **PostgreSQL**

### **Tools & Deployment**
- ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) **Git**
- ![Render](https://img.shields.io/badge/Render-%2346E3B7.svg?style=for-the-badge&logo=render&logoColor=white) **Render** (Hosting)
- ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white) **Vercel** (Frontend)

---

## 🛠️ Setup and Installation

### **1. Prerequisites**
Ensure you have **Node.js** and **npm** installed. You will also need a **PostgreSQL** instance (local or hosted on Render/Aiven).

### **2. Clone the Repository**
```bash
git clone https://github.com/your-repo/thebrand.git
cd thebrand
```

### **3. Backend Configuration**
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5001
DATABASE_URL="postgresql://user:password@localhost:5432/thebrand"
JWT_SECRET="your_secret_key"
GOOGLE_CLIENT_ID="your_google_client_id"
```
Run database migrations:
```bash
npx prisma migrate dev
```

### **4. Frontend Configuration**
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5001/api
VITE_GOOGLE_CLIENT_ID="your_google_client_id"
```

---

## 🏃 How to Run the Project

### **Start Backend Server**
```bash
cd backend
npm start
```

### **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```

The application will be accessible at `http://localhost:5173` (or the port specified by Vite).

---

## 🏗️ Architecture Explanation

TheBrand is architected using a **Strict N-Tier / Layered Architecture** to ensure maximum maintainability and separation of concerns.

### **Core Principles**
1. **Separation of Concerns:** Business logic is decoupled from HTTP handling and data persistence.
2. **Type Safety:** TypeScript interfaces are enforced across the entire stack (`IService`, `IUser`, `IBooking`).
3. **SOLID Principles:** Each module has a single responsibility, and dependencies are inverted through abstractions.

### **Backend Layers**
- **Controllers:** Handle HTTP requests/responses and extract data.
- **Services:** Execute core business logic and validation rules.
- **Repositories:** Standardized data access layer using Prisma ORM.
- **Models:** Database schema definitions and TypeScript entity interfaces.

### **Design Patterns**
- **Singleton Pattern:** Used for managing the `PrismaClient` instance to optimize database connection pooling.
- **Factory Pattern:** Implemented for dynamic object creation and standardized API response handling.

---

## 👥 Team Members & Contributions

| Member | Role | Contributions |
| :--- | :--- | :--- |
| **Abuzar Haidari** | TL / Architect | System design, UML modeling, architectural documentation, and code quality review. |
| **Soumen Dass** | Lead Developer | Backend implementation, design pattern integration, database schema design, and deployment management. |

---

> [!NOTE]
> This project was developed as part of a System Design & Engineering assignment, focusing on re-architecting a monolithic application into a scalable, type-safe system.
