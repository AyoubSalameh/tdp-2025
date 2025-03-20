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
        try{
            return this.pool.query(sql, params);
        } catch (error) {
            console.error('Error executing query', error);
            throw new Error('Error executing query');
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
                releaseYear INT NOT NULL,
                CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 10),
                CONSTRAINT valid_duration CHECK (duration > 0)
            );`
            ;

        const showtimeTable = `
            CREATE TABLE IF NOT EXISTS showtimes (
                id SERIAL PRIMARY KEY,
                price DECIMAL(5, 2) NOT NULL,
                movieId INT NOT NULL,
                theater TEXT NOT NULL,
                startTime TIMESTAMPTZ NOT NULL,
                endTime TIMESTAMPTZ NOT NULL,
                FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE,
                CONSTRAINT no_overlapping_showtimes EXCLUDE USING gist (
                    theater WITH =,
                    tstzrange(starttime, endtime) WITH &&
                ),
                CONSTRAINT valid_showtime_range CHECK (endtime > starttime)
            );
       `;

       const createGistIndex = `
            CREATE INDEX IF NOT EXISTS showtimes_time_range_gist 
            ON showtimes USING gist (tstzrange(starttime, endtime));
       `;
        
        try {
            await this.pool.query(`CREATE EXTENSION IF NOT EXISTS btree_gist;`);
            await this.pool.query(movieTable);
            await this.pool.query(showtimeTable);
            await this.pool.query(createGistIndex);
            console.log('Schema initialized');
        } catch (error) {
            console.error('Error initializing schema', error);
        }
    }
}