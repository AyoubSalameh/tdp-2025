import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/db.service";
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
            console.log('Ticket booked');
            console.log(result.rows[0]);
            return result.rows[0] as BookingResponseDto;
        }
        catch (error) {
            console.error('Error booking ticket: ', error);
            throw new Error('Error booking ticket');
        }
    }

}