import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";

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
    userId: string;
}

export class BookingResponseDto {

    @IsUUID()
    @IsNotEmpty()
    bookingId: string;
}