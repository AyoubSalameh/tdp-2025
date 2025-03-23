import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../db.service";
import { CreateShowtimeDto, ShowtimeResponseDto } from "./create-showtime.dto";

@Injectable()
export class ShowtimesService {
    constructor(private readonly databaseService: DatabaseService) {}

    async getAllShowtimes(): Promise<ShowtimeResponseDto[]> {
        const sql = 'SELECT id, price::FLOAT AS price, "movieId", theater, "startTime", "endTime" FROM showtimes;';
        const params = [];
        const result = await this.databaseService.query(sql, params);
        if (result.rows.length === 0) {
            return [];
        }
        return result.rows as ShowtimeResponseDto[];
    }

    async getShowtimeById(showtimeId: number): Promise<ShowtimeResponseDto> {
        const sql = `
            SELECT id, price::FLOAT AS price, "movieId", theater, "startTime", "endTime"
            FROM showtimes
            WHERE id = $1;
        `
        const params = [showtimeId];
        const result = await this.databaseService.query(sql, params);
        if (result.rows.length === 0) {
            throw new NotFoundException('Showtime not found');
        }
        return result.rows[0] as ShowtimeResponseDto;
    }

    async addShowtime(showtime: CreateShowtimeDto): Promise<ShowtimeResponseDto> {
        const sql = `
            INSERT INTO showtimes (price, "movieId", theater, "startTime", "endTime")
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, price::FLOAT AS price, "movieId", theater, "startTime", "endTime";
        `;
        const params = [showtime.price, showtime.movieId, showtime.theater, showtime.startTime, showtime.endTime];
        try {
            const result = await this.databaseService.query(sql, params);
            if (result.rows.length === 0) {
                throw new BadRequestException("invalid request")
            }
            return result.rows[0] as ShowtimeResponseDto;
        } catch (error) {
            if (error.code === '23503') {
                throw new NotFoundException('Movie not found');
            } else if (error.code === '23P01') {
                throw new BadRequestException('Showtime overlaps with existing showtime');
            } else if (error.code === '23514') {
                throw new BadRequestException('End time must be after start time');
            }
            else {
                throw new Error('Error adding showtime');
            }
        }
    }

    async updateShowtime(showtimeId: number, showtime: CreateShowtimeDto) {
        const sql = `
            UPDATE showtimes
            SET price = $2, "movieId" = $3, theater = $4, "startTime" = $5, "endTime" = $6
            WHERE id = $1
            RETURNING id, price::FLOAT AS price, "movieId", theater, "startTime", "endTime";
        `;
        const params = [showtimeId, showtime.price, showtime.movieId, showtime.theater, showtime.startTime, showtime.endTime];
        try{
            const result = await this.databaseService.query(sql, params);
            if (result.rows.length === 0) {
                throw new NotFoundException('Showtime not found');
            }
            return result.rows[0] as ShowtimeResponseDto;
        } catch (error) {
            if (error.code === '23503') {
                throw new NotFoundException('Movie not found');
            } else if (error.code === '23P01') {
                throw new BadRequestException('Showtime overlaps with existing showtime');
            } else if (error.code === '23514') {
                throw new BadRequestException('End time must be after start time');
            }
            throw error;
        }
        
    }

    async deleteShowtime(showtimeId: number): Promise<void> {
        const sql = `
            DELETE FROM showtimes
            WHERE id = $1;
        `;
        const params = [showtimeId];
        const result = await this.databaseService.query(sql, params);
        if (result.rowCount === 0) {
            throw new NotFoundException('Showtime not found');
        }
    }

}