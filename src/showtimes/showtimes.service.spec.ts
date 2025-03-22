import { Test } from '@nestjs/testing';
import { ShowtimesService } from './showtimes.service';
import { DatabaseService } from '../db.service';
import { CreateShowtimeDto, ShowtimeResponseDto } from './create-showtime.dto';

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

});