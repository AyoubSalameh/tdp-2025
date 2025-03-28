import { DatabaseService } from '../src/db.service';
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { response } from 'express';
import exp from 'constants';

describe('MoviesController (e2e)', () => {
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

    // Sanity check for movies
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

        expect(response.body).toHaveProperty('id');
        expect(response.body.price).toBe(30);
        expect(response.body.movieId).toBe(1);
        expect(response.body.theater).toBe('Theater 1');
        expect(response.body.startTime).toBe('2021-09-06T12:00:00.000Z');
        expect(response.body.endTime).toBe('2021-09-06T14:00:00.000Z');
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

        expect(response.body).toHaveProperty('id');
        expect(response.body.price).toBe(30);
        expect(response.body.movieId).toBe(1);
        expect(response.body.theater).toBe('Theater 1');
        expect(response.body.startTime).toBe('2021-09-06T12:00:00.000Z');
        expect(response.body.endTime).toBe('2021-09-06T14:00:00.000Z');
    });

    it('should fail to add a showtime with an invalid movieId', async () => {
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

    it('should fail to add a showtime with an overlapping time', async () => {
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

    it('should succeed to add another showtime with a valid time', async () => {
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
        expect(response.body).toHaveProperty('id');
        expect(response.body.price).toBe(30);
        expect(response.body.movieId).toBe(1);
        expect(response.body.theater).toBe('Theater 1');
        expect(response.body.startTime).toBe('2021-09-06T15:00:00.000Z');
        expect(response.body.endTime).toBe('2021-09-06T17:00:00.000Z');

    });

    it('should fail to update a non existent showtime', async () => {
        const response = await request(app.getHttpServer())
        .post('/showtimes/update/41')
        .send({
            movieId: 1,
            price: 30,
            theater: "Theater 1",
            startTime: '2021-09-06T15:00:00.000Z',
            endTime: '2021-09-06T17:00:00.000Z'
        })
        .expect(404);
    });

    it('should fail to update a showtime with an invalid movieId', async () => {
        const response = await request(app.getHttpServer())
        .post('/showtimes/update/1')
        .send({
            movieId: 2,
            price: 30,
            theater: "Theater 1",
            startTime: '2021-09-06T12:00:00.000Z',
            endTime: '2021-09-06T14:00:00.000Z'
        })
        .expect(404);
    });

    it('should fail to update a showtime with an overlapping time', async () => {
        const response = await request(app.getHttpServer())
        .post('/showtimes/update/1')
        .send({
            movieId: 1,
            price: 30,
            theater: "Theater 1",
            startTime: '2021-09-06T14:00:00.000Z',
            endTime: '2021-09-06T16:00:00.000Z'
        })
        .expect(400);
    });

    it('should succeed to update a showtime with a valid time', async () => {
        await request(app.getHttpServer())
        .post('/showtimes/update/1')
        .send({
            movieId: 1,
            price: 30,
            theater: "Theater 1",
            startTime: '2021-09-07T14:00:00.000Z',
            endTime: '2021-09-07T16:00:00.000Z'
        })
        .expect(200)
    });

    it('should fail to delete a non existent showtime', async () => {
        await request(app.getHttpServer())
        .delete('/showtimes/41')
        .expect(404);
    });

    it('should succeed to delete a showtime', async () => {
        await request(app.getHttpServer())
        .delete('/showtimes/1')
        .expect(200);
    });

    it('should fail to add a showtime with missing fields', async () => {
        await request(app.getHttpServer())
        .post('/showtimes')
        .send({
            movieId: 1,
            theater: "Theater 1",
            startTime: '2021-09-08T12:00:00.000Z',
            endTime: '2021-09-08T10:00:00.000Z'
        })
        .expect(400);
    });


});