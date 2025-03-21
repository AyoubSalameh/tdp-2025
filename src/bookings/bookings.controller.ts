import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { BookingResponseDto, CreateBookingDto } from "./create-booking.dto";

@Controller('bookings')
export class BookingsController {

    constructor(private readonly bookingsService: BookingsService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    bookTicket(@Body() ticket: CreateBookingDto): Promise<BookingResponseDto> {
        return this.bookingsService.bookTicket(ticket);
    }

}