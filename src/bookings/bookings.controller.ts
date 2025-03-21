import { Controller, Post, Body } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { BookingResponseDto, CreateBookingDto } from "./create-booking.dto";

@Controller('bookings')
export class BookingsController {

    constructor(private readonly bookingsService: BookingsService) {}

    @Post()
    bookTicket(@Body() ticket: CreateBookingDto): Promise<BookingResponseDto> {
        return this.bookingsService.bookTicket(ticket);
    }

}