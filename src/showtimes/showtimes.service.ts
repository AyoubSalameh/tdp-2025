import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../db.service";
import { CreateShowtimeDto, ShowtimeResponseDto } from "./create-showtime.dto";

@Injectable()
export class ShowtimesService {
    constructor(private readonly databaseService: DatabaseService) {}

    async getAllShowtimes(): Promise<CreateShowtimeDto[]> {
        const sql = 'SELECT * FROM showtimes;';
        const params = [];
        try {
            const result = await this.databaseService.query(sql, params);
            console.log(result.rows);
            if (result.rows.length === 0) {
                return [];
            }
            return result.rows as CreateShowtimeDto[];
        }
        catch (error) {
            console.error('error getting all showtimes: ', error);
            throw new Error('Error getting all showtimes');
        }
    }

    async getShowtimeById(showtimeId: string): Promise<ShowtimeResponseDto> {
        const sql = `
            SELECT * FROM showtimes
            WHERE id = $1;
        `
        const params = [showtimeId];
        try {
            const result = await this.databaseService.query(sql, params);
            if (result.rows.length === 0) {
                console.log('no showtime found');
                return null;
            }
            return result.rows[0] as ShowtimeResponseDto;
        } catch (error) {
            console.error('error getting showtime by id: ', error);
            throw new Error('Error getting showtime by id');
        }
    }

    async addShowtime(showtime: CreateShowtimeDto): Promise<ShowtimeResponseDto> {
        const sql = `
            INSERT INTO showtimes (price, movieId, theater, startTime, endTime)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const params = [showtime.price, showtime.movieId, showtime.theater, showtime.startTime, showtime.endTime];
        try {
            const result = await this.databaseService.query(sql, params);
            console.log(showtime);
            console.log(result.rows);
            return result.rows[0] as ShowtimeResponseDto;
        } catch (error) {
            console.error('error adding showtime: ', error);
            throw new Error('Error adding showtime');
        }
    }

    async updateShowtime(showtimeId: string, showtime: CreateShowtimeDto) {
        const sql = `
            UPDATE showtimes
            SET price = $2, movieId = $3, theater = $4, startTime = $5, endTime = $6
            WHERE id = $1
            RETURNING *;
        `;
        const params = [showtimeId, showtime.price, showtime.movieId, showtime.theater, showtime.startTime, showtime.endTime];
        try {
            const result = await this.databaseService.query(sql, params);
            if (result.rows.length === 0) {
                console.log('showtime not found');
                throw new Error('Showtime not found');
            }
            return result.rows[0] as ShowtimeResponseDto;
        } catch (error) {
            console.error('error updating showtime: ', error);
            throw new Error('Error updating showtime');
        }
    }

    async deleteShowtime(showtimeId: string): Promise<void> {
        const sql = `
            DELETE FROM showtimes
            WHERE id = $1;
        `;
        const params = [showtimeId];
        try {
            await this.databaseService.query(sql, params);

        } catch (error) {
            console.error('error deleting showtime: ', error);
            throw new Error('Error deleting showtime');
        }
    }

}