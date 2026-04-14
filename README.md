# 🚀 TheBrand – Scalable Brand Service Management Platform

## 📌 Project Summary and Details
**TheBrand** is a comprehensive service booking and portfolio management system designed for creative agencies, branding studios, and digital service providers. 
- **Goal:** To transform a basic digital storefront into a maintainable, multi-tenant service management tool.
- **Problem Solved:** Overcomes fragmented tracking, poor client handling, and low scalability by applying strict System Design, OOP, and SOLID principles.
- **Tech Stack:** 
  - **Frontend:** React.js, Vite, Tailwind CSS
  - **Backend:** Node.js, Express.js, TypeScript, Prisma (ORM)
  - **Database:** MongoDB / PostgreSQL

🔗 **[Live Demo](https://thebrand-frontend.onrender.com/)** | 🔗 **[GitHub Repository](https://github.com/SoumenDass1/System_Design_Project)**

---

## 🛠️ Where Core Fundamentals Are Used (Detailed Breakdown)

### 🧬 Object-Oriented Programming (OOP) Fundamentals
- **Abstraction:** 
  - *Frontend:* Complex UI logic is hidden behind simple React components like `<ServiceCard />`, `<Navbar />`, `<FilterSidebar />`.
  - *Backend:* Database connectivity details are completely abstracted within the `Database.ts` singleton class. Controllers just use the output, ignorant of how the connection was achieved.
- **Encapsulation:** 
  - *Backend:* In `backend/src/patterns/Database.ts`, the database instance and the constructor are strictly marked as `private`. The outside application can only interact with it safely via the controlled `public static getInstance()` method.
  - *Frontend Context:* Sensitive user and cart data are encapsulated within `AuthContext.jsx` and `CartContext.jsx`, isolating the state modifications through specific provider methods.
- **Inheritance & Polymorphism:** 
  - *Design Integration:* Using Typescript interfaces, specialized service or user roles (like `AdminUser`) inherit base permissions and properties of `BaseUser`. Method overriding allows notifications (`notifyUser()`) to behave differently (SMS vs Email) depending on subclass implementation context.

### 📏 SOLID Principles
- **Single Responsibility Principle (SRP):** 
  - *Backend Route-Controller Split:* Routing (`productRoutes.ts`) strictly handles the API URL definitions, and Controllers (`productController.ts`) strictly hold business logic parameters. Neither touches direct database query schema mapping.
  - *Frontend UI:* Simple components like `ProductCard` handle only displaying data, avoiding any data-fetching or global state modifications directly mapped inside them.
- **Open/Closed Principle (OCP):** 
  - The project is open to extension but closed for modification. We can seamlessly add a brand new `orderController.ts` feature logic and plug it in without risking disruptions to `authController.ts` or `productController.ts`.
- **Liskov Substitution Principle (LSP):** 
  - All customized specialized functions (like `GoogleAuthController`) implement shared authentication interfaces, meaning the core router functions treat all login strategies uniformly without crashing.
- **Interface Segregation Principle (ISP):** 
  - *Backend `interfaces/express.d.ts`:* Segregating specific custom `User` types in Requests instead of dumping all fields into a single massive, bloated object type wrapper. Modules only rely on the strictly needed variable dependencies.
- **Dependency Inversion Principle (DIP):** 
  - Abstracting the database connectivity utilizing **Prisma ORM**. Our Application Logic entirely depends on Prisma's abstract models rather than executing rigid, pure low-level SQL strings. 

### 🧩 Factory Design Pattern
- **Where & How It Is Used/Planned:**
  - The **Factory Pattern** is leveraged centrally within the application's **Service & Portfolio Module** to dynamically instantiate different structural types of digital services depending on client request dynamics. 
  - *Implementation Logic Details:* A specific `ServiceFactory` acts as the object builder. You pass an identifier keyword to it (e.g., `"WebDesignService"` or `"SEO_Service"`). Instead of bloating controllers with complex IF/ELSE initializers, the generic Factory delegates creation autonomously and correctly instantiates the assigned specialized object. 

---

## ✨ System Architecture & Workflow 

### 🏛️ N-Tier Architecture Layers
The project utilizes clean architecture split firmly into:
1. **Presentation Layer (UI):** React components for visual rendering.
2. **Business Logic Layer (Services/Controllers):** Performs rigorous validations and executes rules (`authController.ts`).
3. **Data Access Layer (ORM):** Prisma abstracts complex relational tables mapping.
4. **Persistence Layer (Database):** External SQL/NoSQL DB storing durable entity forms.

### ⚙️ How to Install and Run
1. **Clone the Repo:** `git clone https://github.com/SoumenDass1/System_Design_Project.git`
2. **Frontend:** `cd frontend` ➝ `npm install` ➝ `npm run dev`
3. **Backend:** `cd backend` ➝ `npm install` ➝ `npm run dev`

---

| Member | Role | Contributions |
| :--- | :--- | :--- |
| **Abuzar Haidari** | TL / Architect | System design, UML modeling, architectural documentation, and code quality review. |
| **Soumen Dass** | Lead Developer | Backend implementation, design pattern integration, database schema design, and deployment management. |

