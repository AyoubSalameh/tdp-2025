import { Test } from '@nestjs/testing';
import { ShowtimesService } from './showtimes.service';
import { DatabaseService } from '../db.service';
import { CreateShowtimeDto, ShowtimeResponseDto } from './create-showtime.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import exp from 'constants';
import { error } from 'console';

describe('ShowtimesService', () => {

    let service: ShowtimesService;
    let db: DatabaseService;

    beforeEach(async () => {
            const module = await Test.createTestingModule({
                providers: [
                    ShowtimesService,
                    {
                        provide: DatabaseService,
                        useValue: {query: jest.fn()}
                    }
                ],
            }).compile();
    
            service = module.get<ShowtimesService>(ShowtimesService);
            db = module.get<DatabaseService>(DatabaseService);
    });
    
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    const showtime: CreateShowtimeDto = {
        movieId: 1,
        price: 20,
        theater: 'Theater 1',
        startTime: new Date(),
        endTime: new Date()
    }

    const showtimeResponse: ShowtimeResponseDto = {
        id: 1,
        movieId: 1,
        price: 20,
        theater: 'Theater 1',
        startTime: new Date(),
        endTime: new Date()
    }

    //testing GET - getAllShowtimes
    describe('getAllShowtimes', () => {
        it('should return all showtimes', async () => {
            db.query = jest.fn().mockResolvedValue({rows: []});
            const result = await service.getAllShowtimes();
            expect(result).toEqual([]);
        });

        it('should return array with one showtime', async () => {
            db.query = jest.fn().mockResolvedValue({rows: [showtimeResponse]});
            const result = await service.getAllShowtimes();
            expect(result).toEqual([showtimeResponse]);
        });
    });

    //testing GET - getShowtimeById
    describe('getShowtimeById', () => {
        it("should fail to return a non-existent showtime", async () => {
            db.query = jest.fn().mockResolvedValue({rows: []});
            await expect(service.getShowtimeById('1')).rejects.toThrow(NotFoundException);
        });

        it("should return a showtime", async () => {
            db.query = jest.fn().mockResolvedValue({rows: [showtimeResponse]});
            const result = await service.getShowtimeById('1');
            expect(result).toEqual(showtimeResponse);
        });
    });

    //testing POST - addShowtime
    describe('addShowtime', () => {
        it('should add a showtime', async ()=> {
            db.query = jest.fn().mockResolvedValue({rows: [showtimeResponse]});
            const result = await service.addShowtime(showtime);
            expect(result).toEqual(showtimeResponse);
        });

        const invalidShowtime: CreateShowtimeDto = {
            movieId: 1,
            price: -20,
            theater: 'Theater 1',
            startTime: new Date('2025-01-01T14:00:00Z'),
            endTime: new Date('2025-01-01T14:00:00Z')
        }

        it('should throw an error if the showtime is invalid', async () => {
            db.query = jest.fn().mockRejectedValue({code: '23503'});
            await expect(service.addShowtime(invalidShowtime)).rejects.toThrow(NotFoundException);
        });

        it('should throw an error if the showtime overlaps with existing showtime', async () => {
            db.query = jest.fn().mockRejectedValue({code: '23P01'});
            await expect(service.addShowtime(invalidShowtime)).rejects.toThrow(BadRequestException);
        });

        const invalidShowtime2: CreateShowtimeDto = {
            movieId: 1,
            price: 20,
            theater: 'Theater 1',
            startTime: new Date('2025-01-01T14:00:00Z'),
            endTime: new Date('2025-01-01T13:00:00Z')
        }

        it('should throw an error if the end time is before the start time', async () => {
            db.query = jest.fn().mockRejectedValue({code: '23514'});
            await expect(service.addShowtime(invalidShowtime2)).rejects.toThrow(BadRequestException);
        });
    });

    //testing POST - updateShowtime
    describe('updateShowtime', () => {
        const updatedShowtime = {...showtime, price: 25};
        const updatedShowtimeResponse = {...showtimeResponse, price: 25};

        it('should update a showtime', async () => {
            db.query = jest.fn().mockResolvedValue({rows: [updatedShowtimeResponse]});
            const result = await service.updateShowtime('1', updatedShowtime);
            expect(result).toEqual(updatedShowtimeResponse);
        });

        it('should throw an error if the showtime is not found', async () => {
            db.query = jest.fn().mockResolvedValue({rows: []});
            await expect(service.updateShowtime('1', updatedShowtime))
            .rejects.toThrow(NotFoundException);
        });

        it('show throw error if movie is not found', async () => {
            db.query = jest.fn().mockRejectedValue({code: '23503'});
            await expect(service.updateShowtime('1', updatedShowtime))
            .rejects.toThrow(NotFoundException);
        });

        it('should throw an error if the showtime overlaps with existing showtime', async () => {
            db.query = jest.fn().mockRejectedValue({code: '23P01'});
            await expect(service.updateShowtime('1', updatedShowtime))
            .rejects.toThrow(BadRequestException);
        });
        
        it('should throw an error if the end time is before the start time', async () => {
            db.query = jest.fn().mockRejectedValue({code: '23514'});
            await expect(service.updateShowtime('1', updatedShowtime))
            .rejects.toThrow(BadRequestException);
        });

    });

    //testing DELETE - deleteShowtime
    describe('deleteShowtime', () => {
        it('should delete a showtime', async () => {
            db.query = jest.fn().mockResolvedValue({rows: [showtimeResponse]});
            const result = await service.deleteShowtime('1');
            expect(result).toBeUndefined();
        });

        it('should throw an error if the showtime is not found', async () => {
            db.query = jest.fn().mockResolvedValue({rowCount: 0});
            await expect(service.deleteShowtime('1')).rejects.toThrow(NotFoundException);
        });
    });


});