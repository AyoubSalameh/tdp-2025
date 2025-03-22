import { DatabaseService } from '../src/db.service';
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { response } from 'express';

describe('MoviesController (e2e)', () => {
    let app: INestApplication;
    let db: DatabaseService;

    beforeAll( async () => {

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        db = moduleFixture.get<DatabaseService>(DatabaseService);
        await app.init();

        await db.query(`TRUNCATE TABLE movies, showtimes RESTART IDENTITY CASCADE;`, []);

        const response = await request(app.getHttpServer())
        .post('/movies')
        .send({
            title: 'Interstellar',
            genre: 'Sci-Fi',
            duration: 169,
            rating: 8.7,
            releaseYear: 2014
        })
        .expect(200)

    });

    afterAll( async () => {
        await db.query(`TRUNCATE TABLE movies, bookings RESTART IDENTITY CASCADE`, []);
        await app.close();
    });

    it('Should return a list with only one movie', async () => {
        const response = await request(app.getHttpServer())
        .get('/movies/all').expect(200);
        expect(response.body).toEqual([
            {
                id: 1,
                title: 'Interstellar',
                genre: 'Sci-Fi',
                duration: 169,
                rating: 8.7,
                releaseYear: 2014
            }
        ]);
    })

    it('should return an empty list of showtimes', async () => {
        await request(app.getHttpServer())
        .get('/showtimes/all')
        .expect(200)
        .expect([]);
    });

    it('get a specific showtime that does not exist', async () => {
        await request(app.getHttpServer())
        .get('/showtimes/1')
        .expect(404);
    });

    it('should add a showtime and return it with id field', async () => {
        const response = await request(app.getHttpServer())
        .post('/showtimes')
        .send({
            movieId: 1,
            price: 30,
            theater: "Theater 1",
            startTime: '2021-09-06T12:00:00.000Z',
            endTime: '2021-09-06T14:00:00.000Z'
        })
        .expect(200)
        expect(response.body).toEqual({
            id: 1,
            price: 30,
            movieId: 1,
            theater: "Theater 1",
            startTime: '2021-09-06T12:00:00.000Z',
            endTime: '2021-09-06T14:00:00.000Z'

        });
    });

    it('should return a list containing one showtime', async () => {
        const response = await request(app.getHttpServer())
        .get('/showtimes/all')
        .expect(200)
        expect(response.body).toEqual([{
            id: 1,
            price: 30,
            movieId: 1,
            theater: "Theater 1",
            startTime: '2021-09-06T12:00:00.000Z',
            endTime: '2021-09-06T14:00:00.000Z'
        }])
    })

    it('should return a specific showtime', async () => {
        const response = await request(app.getHttpServer())
        .get('/showtimes/1')
        .expect(200)
        expect(response.body).toEqual({
            id: 1,
            price: 30,
            movieId: 1,
            theater: "Theater 1",
            startTime: '2021-09-06T12:00:00.000Z',
            endTime: '2021-09-06T14:00:00.000Z'
        });
    });

    it('it should fail to add a showtime with an invalid movieId', async () => {
        const response = await request(app.getHttpServer())
        .post('/showtimes')
        .send({
            movieId: 2,
            price: 30,
            theater: "Theater 1",
            startTime: '2021-09-06T16:00:00.000Z',
            endTime: '2021-09-06T18:00:00.000Z'
        })
        .expect(404);
    });

    it('it should fail to add a showtime with an overlapping time', async () => {
        const response = await request(app.getHttpServer())
        .post('/showtimes')
        .send({
            movieId: 1,
            price: 30,
            theater: "Theater 1",
            startTime: '2021-09-06T13:00:00.000Z',
            endTime: '2021-09-06T15:00:00.000Z'
        })
        .expect(400);
    });

    it('it should succeed to add another showtime with a valid time', async () => {
       const response = await request(app.getHttpServer())
        .post('/showtimes')
        .send({
            movieId: 1,
            price: 30,
            theater: "Theater 1",
            startTime: '2021-09-06T15:00:00.000Z',
            endTime: '2021-09-06T17:00:00.000Z'
        })
        .expect(200)
    
    });


});