import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../db.service";
import { BookingResponseDto, CreateBookingDto } from "./create-booking.dto";

@Injectable()
export class BookingsService {

    constructor(private readonly databaseService: DatabaseService) {}

    async bookTicket(booking: CreateBookingDto): Promise<BookingResponseDto> {
        const sql = `
            INSERT INTO bookings (showtimeId, seatNumber, userId) 
            VALUES ($1, $2, $3)
            RETURNING bookingId;
        `
        const params = [booking.showtimeId, booking.seatNumber, booking.userId];
        try {
            const result = await this.databaseService.query(sql, params);
            if (result.rows.length === 0) {
                throw new BadRequestException('Invalid request');
            }
            return result.rows[0] as BookingResponseDto;
        }
        catch (error) {
            if (error.code === '23503') {
                throw new NotFoundException('Showtime not found');
            }
            else if (error.code === '23505') {
                throw new BadRequestException('Seat already booked');
            }
            else {
                console.error('Error booking ticket: ', error);
                throw new Error('Error booking ticket');
            }
        }
    }

}