import { UUID } from "crypto";

export class CreateBookingDto {
    showtimeId: number;
    seatNumber: number;
    userId: UUID;
}

export class BookingResponseDto {
    bookingId: UUID;
}