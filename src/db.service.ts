import { Injectable } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class DatabaseService {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            host: 'localhost',
            user: 'popcorn-palace',
            password: 'popcorn-palace',
            database: 'popcorn-palace',
            port: 5432
            });
    }

    async query(sql: string, params: any[]): Promise<any> {
        return this.pool.query(sql, params);
    }

    async onModuleInit(): Promise<void> {
        await this.initializeSchema();
    };

    async onModuleDestroy(): Promise<void> {
        await this.pool.end();
        console.log('Connection pool closed');
    }

    private async initializeSchema(): Promise<void> {
        const movieTable = `
            CREATE TABLE IF NOT EXISTS movies (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                genre TEXT NOT NULL,
                duration INT NOT NULL,
                rating DECIMAL(3, 1) NOT NULL,
                releaseYear INT NOT NULL
            );`
            ;
        try {
            await this.pool.query(movieTable);
            console.log('Schema initialized');
        } catch (error) {
            console.error('Error initializing schema', error);
        }
    }
}