# 🚀 TheBrand – Scalable Brand Service Management Platform

🔗 **[Live Demo](https://thebrand-frontend.onrender.com/)** | 🔗 **[GitHub Repository](https://github.com/SoumenDass1/System_Design_Project)**

## 📌 Project Overview
**TheBrand** is a comprehensive service booking and portfolio management system designed for creative agencies, branding studios, and digital service providers. Built with a focus on clean architecture and modularity, the system is designed to grow from a simple digital storefront into a multi-tenant service management tool.

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: Prisma, SQL (PostgreSQL/MySQL)
- **Deployment**: Render, GitHub Pages
- **Version Control**: Git, GitHub

## ⚙️ Setup and Installation Instructions

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16.x or higher)
- npm or yarn

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/SoumenDass1/System_Design_Project.git
   cd System_Design_Project
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```

3. **Backend Setup:**
   ```bash
   cd ../backend
   npm install
   ```

## ▶️ How to Run the Project

1. **Run the Frontend (Development Server):**
   ```bash
   cd frontend
   npm run dev
   ```
   *The frontend will typically be accessible at `http://localhost:5173`.*

2. **Run the Backend (Development Server):**
   ```bash
   cd backend
   npm run dev
   ```
   *The backend server will start and listen for API requests.*

## 🏛️ Architecture Explanation
The project is adapting an **N-Tier Architecture**, cleanly separating responsibilities into distinct layers for modularity and scalability:

1. **Presentation Layer (UI):** React components responsible solely for rendering data and capturing user events.
2. **Business Logic Layer (Services):** Dedicated service classes that handle data processing, validation, and domain rules.
3. **Data Access Layer (Repositories):** Abstracts database queries, ensuring the business logic remains database-agnostic.
4. **Persistence Layer:** The underlying database (managed via Prisma) handling data storage.

This structure enforces **Clean Architecture** and **Separation of Concerns (SoC)**, ensuring that no single module handles more than its core responsibility, making the system easy to maintain and scale.

## 👥 Team Members and Contributions

| Name | Role / Contributions |
| :--- | :--- |
| **Soumen Dass** | System Architecture, Initial Setup |
| **Abuzar Haideri** | DevOps, Repo Maintenance, Integration |
| **[Add Name Here]** | [Add Contribution Here] |
| **[Add Name Here]** | [Add Contribution Here] |

*(Note: Please update the table above with your complete team details.)*
