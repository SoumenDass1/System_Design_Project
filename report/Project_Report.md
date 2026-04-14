# PROJECT REPORT: TheBrand – Scalable Brand Service Management Platform

**Team Members:** Soumen Dass, Abuzar Haideri  
**Project Goal:** Democratic Digital Branding for SMEs

---

## 1. Problem Statement & Vision

**The Market Gap**  
Large corporations dominate the digital space because they have the capital to build premium brand value. Small and medium-scale enterprises (SMEs) often have high-quality products but lack the "Brand Identity" and technical infrastructure to compete. Building a custom website is expensive, and existing marketplaces often feel cluttered or impersonal.

**The Solution: "TheBrand"**  
Our platform provides a ready-to-use digital ecosystem where local and middle-level brands can showcase and sell their products without any upfront development costs. It bridges the gap between local craftsmanship and professional digital presence, allowing anyone to open a digital store in minutes.

---

## 2. Business & Revenue Model

To ensure the platform is accessible yet sustainable, we implemented a performance-based revenue model:
- **Zero Barrier to Entry:** Sellers pay nothing to set up their store, removing the financial risk for small creators.
- **Platform Fee:** A 5% flat platform fee to cover server costs, maintenance, and infrastructure.
- **Commission Model:** A 10% commission on every sale.
- **Incentive Alignment:** Our platform only profits when the sellers profit. This 10%/5% split ensures the sellers retain the majority of their margins (85%) while gaining professional-grade tools.

---

## 3. System Design & Technical Optimization

Since the platform is designed for multiple brands, the architecture must be robust:
- **Multi-Tenant Architecture:** The system is designed to isolate data between different sellers while sharing the same core infrastructure, ensuring high scalability.
- **N-Tier Layering:** We strictly separated the Presentation Layer (React.js), Business Logic (Node.js/Express), and Data Access (Prisma ORM) to prevent code fragility.
- **Prisma ORM & PostgreSQL:** Used to manage complex relationships between Sellers, Products, and Transactions with high integrity and speed.

---

## 4. OOP & SOLID Principles in Action

- **Singleton Pattern:** Applied to the database connection (`Database.ts`) to manage resources efficiently and prevent connection leaks during high traffic.
- **Factory Pattern:** Used to instantiate different types of digital storefronts or service modules based on the seller's category (e.g., Retail vs. Digital Services).
- **Single Responsibility (SRP):** We separated the Fee Calculation Logic into its own utility module. This allows us to adjust commission percentages (like the 10% or 5% fees) in one place without touching the checkout or inventory code.
- **Open/Closed Principle:** The platform is "Open for Extension"—we can add new payment gateways or shipping modules without modifying the core seller logic.

---

## 5. Test Cases and Results

| Test ID | Scenario | Input | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC01** | Revenue Split | $200 Transaction | $20 Comm. + $10 Fee = $170 to Seller | Passed |
| **TC02** | Store Isolation | Brand A Login | Cannot see Brand B’s private dashboard | Passed |
| **TC03** | Data Integrity | Large Product List | Prisma handles 100+ items without lag | Passed |
| **TC04** | Auth Security | Guest User | Redirected from "Add Product" page | Passed |
| **TC05** | Singleton Check | Multiple Requests | Only one active DB connection pool | Passed |

---

## 6. Future Roadmap

- **AI Branding Tools:** Helping local sellers generate high-quality product descriptions and logos automatically.
- **Logistics Integration:** Partnering with delivery services to offer end-to-end fulfillment for small brands.
- **Mobile App:** A lightweight app for sellers to manage inventory and view sales analytics on the go.

---

## 7. Conclusion

TheBrand is designed to empower the "underdogs" of the economy. By leveraging System Design and clean OOP architecture, we have built a platform that isn't just a website, but a scalable business engine for local and middle-level brands to grow their identity and revenue simultaneously.
