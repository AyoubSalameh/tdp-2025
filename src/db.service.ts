import { Injectable } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class DatabaseService {
    private pool: Pool;

    constructor() {
        const isTestEnv = process.env.NODE_ENV === 'test';
    
        this.pool = new Pool({
            host: 'localhost',
            user: 'popcorn-palace',
            password: 'popcorn-palace',
            database: 'popcorn-palace',
            port: 5432
        });
        
    }

    async query(sql: string, params: any[]): Promise<any> {
        try{
            return this.pool.query(sql, params);
        } catch (error) {
            console.error('Error executing query', error.message);
            throw error;
        }
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
                "releaseYear" INT NOT NULL,
                CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 10),
                CONSTRAINT valid_duration CHECK (duration > 0)
            );`
            ;

        const showtimeTable = `
            CREATE TABLE IF NOT EXISTS showtimes (
                id SERIAL PRIMARY KEY,
                price DECIMAL(5, 2) NOT NULL,
                "movieId" INT NOT NULL,
                theater TEXT NOT NULL,
                "startTime" TIMESTAMPTZ NOT NULL,
                "endTime" TIMESTAMPTZ NOT NULL,
                FOREIGN KEY ("movieId") REFERENCES movies(id) ON DELETE CASCADE,
                CONSTRAINT no_overlapping_showtimes EXCLUDE USING gist (
                    theater WITH =,
                    tstzrange("startTime", "endTime") WITH &&
                ),
                CONSTRAINT valid_showtime_range CHECK ("endTime" > "startTime")
            );
        `;

        const createGistIndex = `
            CREATE INDEX IF NOT EXISTS showtimes_time_range_gist 
            ON showtimes USING gist (tstzrange("startTime", "endTime"));
        `;

        const bookingTable = `
            CREATE TABLE IF NOT EXISTS bookings (
                "bookingId" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                "showtimeId" INT NOT NULL,
                "seatNumber" INT NOT NULL,
                "userId" UUID NOT NULL,
                FOREIGN KEY ("showtimeId") REFERENCES showtimes(id) ON DELETE CASCADE,
                CONSTRAINT no_double_booking UNIQUE ("showtimeId", "seatNumber")
            )
        `;
        
        try {
            await this.pool.query(`CREATE EXTENSION IF NOT EXISTS btree_gist;`);
            await this.pool.query(movieTable);
            await this.pool.query(showtimeTable);
            await this.pool.query(createGistIndex);
            await this.pool.query(bookingTable);
            console.log('Schema initialized');
        } catch (error) {
            console.error('Error initializing schema', error);
        }
    }
}