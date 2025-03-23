import { Test } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { DatabaseService } from '../db.service';
import { CreateBookingDto, BookingResponseDto } from './create-booking.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import exp from 'constants';
import { error } from 'console';

describe('BookingsService', () => {

    let service: BookingsService;
    let db: DatabaseService;

    beforeEach(async () => {
            const module = await Test.createTestingModule({
                providers: [
                    BookingsService,
                    {
                        provide: DatabaseService,
                        useValue: {query: jest.fn()}
                    }
                ],
            }).compile();
    
            service = module.get<BookingsService>(BookingsService);
            db = module.get<DatabaseService>(DatabaseService);
    });
    
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    const booking: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 1,
        userId: "84438967-f68f-4fa0-b620-0f08217e76af"
    }


    //testing POST - bookTicket
    describe('bookTicket', () => {
        it('should return booking', async () => {
            db.query = jest.fn().mockResolvedValue({rows: [booking]});
            const result = await service.bookTicket(booking);
            expect(result).toHaveProperty('bookingId');
            expect(result.bookingId).toEqual(expect.any(String));
        });

        it('should return error if showtime not found', async () => {
            db.query = jest.fn().mockRejectedValue({code: '23503'});
            await expect(service.bookTicket(booking)).rejects.toThrow(NotFoundException);
        });

        it('should return error if seat already booked', async () => {
            db.query = jest.fn().mockRejectedValue({code: '23505'});
            await expect(service.bookTicket(booking)).rejects.toThrow(BadRequestException);
        });

        it('should return error if error booking ticket', async () => {
            db.query = jest.fn().mockRejectedValue({code: '12345'});
            await expect(service.bookTicket(booking)).rejects.toThrow(Error);
        });
    });

});