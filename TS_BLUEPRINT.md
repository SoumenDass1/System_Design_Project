# 📘 TheBrand – TypeScript Migration & Architecture Blueprint

A senior engineering blueprint for migrating **TheBrand** to a clean, scalable, type-safe architecture using React, Node.js, and TypeScript. This document outlines the N-Tier structural guidelines, strict typings, and design patterns needed for academic and production excellence.

---

## 1. FINAL PROJECT STRUCTURE

A properly segregated monorepo architecture preventing cross-contamination between UI rendering and business logic.

```text
TheBrand/
├── frontend/                 # React + TypeScript Ecosystem
│   ├── src/
│   │   ├── components/       # Reusable, pure functional UI elements
│   │   ├── pages/            # Route-level view components
│   │   ├── hooks/            # Custom typed React hooks
│   │   ├── services/         # API integration (Axios wrappers)
│   │   ├── types/            # Global TS entity interfaces
│   │   ├── utils/            # Helper functions
│   │   └── App.tsx           # Application entry point
│   ├── tsconfig.json
│   └── package.json
├── backend/                  # Node + Express + TypeScript
│   ├── src/
│   │   ├── controllers/      # HTTP request/response handlers (Presentation)
│   │   ├── services/         # Core business logic (Domain)
│   │   ├── repositories/     # Data access and DB interactions (Persistence)
│   │   ├── models/           # DB Schemas & generic types
│   │   ├── interfaces/       # Domain contracts (IService, IBooking)
│   │   ├── routes/           # Router definitions
│   │   ├── config/           # Environment and App config
│   │   ├── patterns/         # Implemented GoF design patterns
│   │   ├── middlewares/      # Request Interceptors (Auth, Errors)
│   │   └── index.ts          # Express Server entry
│   ├── tsconfig.json
│   └── package.json
├── docs/                     # Diagrams and UML
└── README.md
```

---

## 2. FRONTEND MIGRATION (React + TS)

**Migration Steps:**
1. Rename component files from `.js`/`.jsx` to `.tsx`.
2. Rename utility/API files from `.js` to `.ts`.
3. Stop relying on `PropTypes` and strictly type all component `props`.

### Example: Typed Component & API Call
```tsx
// frontend/src/types/IService.ts
export interface IService {
  id: string;
  title: string;
  description: string;
  price: number;
}

// frontend/src/services/api.ts
import axios from 'axios';
import { IService } from '../types/IService';

export const fetchServices = async (): Promise<IService[]> => {
  const response = await axios.get<IService[]>('/api/services');
  return response.data; // TypeScript now guarantees response.data is IService[]
};

// frontend/src/components/ServiceCard.tsx
import React from 'react';
import { IService } from '../types/IService';

interface ServiceCardProps {
  service: IService;
  onBook: (id: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook }) => {
  return (
    <div className="card">
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <span>${service.price}</span>
      <button onClick={() => onBook(service.id)}>Book Service</button>
    </div>
  );
};

export default ServiceCard;
```

---

## 3. BACKEND SETUP (TypeScript)

**Dependencies to install in `backend/`:**
```bash
npm install express mongoose dotenv cors
npm install -D typescript ts-node @types/express @types/node @types/cors
npx tsc --init
```

### Essential `tsconfig.json` Configuration
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,                 // ENFORCES NO ANY OR IMPLICIT NULLS!
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```

### `package.json` Scripts
```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts"
}
```

---

## 4. BACKEND ARCHITECTURE (IMPORTANT)

Following **Clean Architecture** patterns, the backend is strictly layered to decouple dependencies.
- **`controllers/`**: Extracts data from the HTTP `req`, sends it to the service, and formats the `res`. No DB reads here.
- **`services/`**: The heart. Applies business rules (e.g., determining if a booking requires immediate payment).
- **`repositories/`**: The only layer allowed to import `mongoose` or DB drivers. It returns pure TypeScript objects.
- **`models/`**: Schema definitions bridging TS interfaces with database entities.
- **`interfaces/`**: Holds contracts required for Inversion of Control / Dependency Injection.

---

## 5. CORE CODE FILES (REQUIRED)

Here is a full vertical slice for a `Service` entity demonstrating isolation.

**1. `src/index.ts` (Entry Server)**
```typescript
import express, { Application } from 'express';
import serviceRoutes from './routes/service.routes';

const app: Application = express();
app.use(express.json());

app.use('/api/services', serviceRoutes);

app.listen(5000, () => console.log('Server running elegantly on TS port 5000'));
```

**2. `src/routes/service.routes.ts`**
```typescript
import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';

const router = Router();
const controller = new ServiceController();

// Binding controller method to preserve 'this' context
router.get('/', controller.getAllServices.bind(controller));

export default router;
```

**3. `src/controllers/service.controller.ts`**
```typescript
import { Request, Response } from 'express';
import { ServiceLogic } from '../services/service.logic';

export class ServiceController {
  private serviceLogic: ServiceLogic;

  constructor() {
    this.serviceLogic = new ServiceLogic();
  }

  public async getAllServices(req: Request, res: Response): Promise<void> {
    try {
      const services = await this.serviceLogic.fetchActiveServices();
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
```

**4. `src/services/service.logic.ts`**
```typescript
import { IService } from '../interfaces/IService';
import { ServiceRepository } from '../repositories/service.repository';

export class ServiceLogic {
  private repository: ServiceRepository;

  constructor() {
    this.repository = new ServiceRepository();
  }

  public async fetchActiveServices(): Promise<IService[]> {
    const services = await this.repository.findAll();
    // Business Rule: Ensure only available services with positive price return
    return services.filter(service => service.price > 0);
  }
}
```

---

## 6. TYPES & INTERFACES

**`backend/src/interfaces/models.ts`**
*(Note: Zero usage of 'any')*

```typescript
export interface IService {
  id: string;
  title: string;
  category: 'DESIGN' | 'MARKETING' | 'DEVELOPMENT';
  price: number;
  isAvailable: boolean;
  createdAt: Date;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CLIENT';
}

export interface IBooking {
  id: string;
  clientId: string; // Foreign key
  serviceId: string; // Foreign key
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED';
  scheduledDate: Date;
}
```

---

## 7. DESIGN PATTERN PREPARATION

Practical integration of GoF Design Patterns solving actual problems.

**1. Singleton Pattern (Database Connection)**
Prevents opening multiple DB client instances and exhausting connection pools.
```typescript
// backend/src/patterns/DatabaseConnection.ts
export class DatabaseConnection {
  private static instance: DatabaseConnection;

  private constructor() {
    // connect to mongoose logic here
    console.log("Database initialized natively once.");
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
}
```

**2. Factory Pattern (Service Processing)**
Encapsulates complex object creation rules based on service type.
```typescript
// backend/src/patterns/ServiceFactory.ts
interface ServiceProcessor {
  process(): string;
}

class DesignProcessor implements ServiceProcessor { process() { return "Processing Design Req"; } }
class MarketingProcessor implements ServiceProcessor { process() { return "Processing Ad Setup"; } }

export class ServiceProcessorFactory {
  static createProcessor(category: 'DESIGN' | 'MARKETING'): ServiceProcessor {
    if (category === 'DESIGN') return new DesignProcessor();
    if (category === 'MARKETING') return new MarketingProcessor();
    throw new Error('Invalid Category');
  }
}
```

---

## 8. SOLID PRINCIPLES

1. **SRP (Single Responsibility):** Controllers ONLY handle HTTP syntax. They know nothing of databases. `repositories/` handle only queries. 
2. **OCP (Open/Closed):** Using the Factory pattern means when we add `DEVELOPMENT` services, we do not modify the core controller. We just write a new `DevProcessor` class.
3. **DIP (Dependency Inversion):** Services don't rely on `mongoose.find()`. They rely on `Repository.findAll()` which returns an `IService` array. If we switch to PostgreSQL, the Service logic stays exactly the same.

---

## 9. MIGRATION STRATEGY

1. **Lock the JS Branch:** Create a new branch (`feat/typescript-migration`). Do not deploy this until 100% complete.
2. **Initialize Build Tooling First:** Set up `tsconfig.json` and adjust Webpack/Vite plugins for the frontend.
3. **Type the Core Models:** Before rewriting logic, write the `interfaces` folder. Establish what data *looks* like.
4. **Migrate Backend Bottom-Up:** 
   - Convert Models -> Repositories -> Services -> Controllers.
   - Use `strict: false` at first, resolve base syntax errors, then turn `strict: true` and fix type gaps.
5. **Migrate Frontend Top-Down:**
   - Convert global stores/contexts first.
   - Convert API call wrappers next.
   - Convert deeply nested UI components lastly, wrapping them firmly in `Props` interfaces.

---

## 10. COMMON MISTAKES TO AVOID

1. **The `any` Trap:** Using `any` defeats the entire purpose of Typescript. It's essentially writing Javascript. Use `unknown` if a type is truly uncertain, and type-guard it.
2. **Type Duplication:** Do not have an `IService` interface in your React project, and another slightly different `IService` in Node. If possible, use a shared mono-repo folder for models, or copy them identically.
3. **Fat Controllers:** Writing business `if/else` logic inside Express routing/controllers.
4. **Exporting Classes Instead of Interfaces:** High-level code should expect an interface, not a concrete implementation.
5. **Skipping `tsconfig` strict checks:** Ensure `"strict": true` remains active. Otherwise, TypeScript allows careless unhandled null references.
