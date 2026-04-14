import { PrismaClient } from '@prisma/client';

export class Database {
    private static instance: PrismaClient;

    private constructor() {
        // Prevent manual instantiation
    }

    public static getInstance(): PrismaClient {
        if (!Database.instance) {
            Database.instance = new PrismaClient();
            console.log('Database instance created.');
        }
        return Database.instance;
    }
}