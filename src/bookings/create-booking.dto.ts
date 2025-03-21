import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";
import { UUID } from "crypto";

export class CreateBookingDto {

    @IsNumber()
    @IsNotEmpty()
    showtimeId: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    seatNumber: number;

    @IsUUID()
    @IsNotEmpty()
    userId: UUID;
}

export class BookingResponseDto {

    @IsUUID()
    @IsNotEmpty()
    bookingId: UUID;
}