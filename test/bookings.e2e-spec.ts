import { DatabaseService } from '../src/db.service';
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { CreateBookingDto } from 'src/bookings/create-booking.dto';

describe('BookingsController (e2e)', () => {
    let app: INestApplication;
    let db: DatabaseService;

    beforeAll( async () => {

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        db = moduleFixture.get<DatabaseService>(DatabaseService);

        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true
        }));
        
        await app.init();
        await db.query(`TRUNCATE TABLE movies, showtimes, bookings RESTART IDENTITY CASCADE;`, []);

        await request(app.getHttpServer())
                .post('/movies')
                .send({
                    title: 'Interstellar',
                    genre: 'Sci-Fi',
                    duration: 169,
                    rating: 8.7,
                    releaseYear: 2014
                })
                .expect(200)
        
        await request(app.getHttpServer())
                .post('/showtimes')
                .send({
                    movieId: 1,
                    price: 20,
                    theater: 'Theater 1',
                    "startTime": "2025-02-14T12:47:46.125405Z",
                    "endTime": "2025-02-14T15:47:46.125405Z"
                })
                .expect(200)
    });

    afterAll( async () => {
        await db.query(`TRUNCATE TABLE movies, bookings RESTART IDENTITY CASCADE`, []);
        await app.close();
    });

    it('should return a not found error for a non existend showtime', async () => {
        await request(app.getHttpServer())
        .post('/bookings')
        .send({
            showtimeId: 2,
            seatNumber: 1,
            userId: "84438967-f68f-4fa0-b620-0f08217e76af"
        }).expect(404);
    });

    it('should return 200, and a booking id', async() => {
        const response = await request(app.getHttpServer())
        .post('/bookings')
        .send({
            showtimeId: 1,
            seatNumber: 1,
            userId: "84438967-f68f-4fa0-b620-0f08217e76af"
        }).expect(200);
        expect(response.body).toHaveProperty('bookingId');
        expect(response.body.bookingId).toEqual(expect.any(String));
    });

    it('should return an error for double booking', async() => {
        await request(app.getHttpServer())
        .post('/bookings')
        .send({
            showtimeId: 1,
            seatNumber: 1,
            userId: "84438967-f68f-4fa0-b620-0f08217e76af"
        }).expect(400);
    });

    it('should return an error for invalid seat number', async() => {
        await request(app.getHttpServer())
        .post('/bookings')
        .send({
            showtimeId: 1,
            seatNumber: 0,
            userId: "84438967-f68f-4fa0-b620-0f08217e76af"
        }).expect(400);
    });
});