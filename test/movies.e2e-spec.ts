import { DatabaseService } from '../src/db.service';
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { AppModule } from "../src/app.module";


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

        await db.query(`TRUNCATE TABLE movies, showtimes, bookings RESTART IDENTITY CASCADE;`, []);
    });

    afterAll( async () => {
        await db.query(`TRUNCATE TABLE movies, bookings RESTART IDENTITY CASCADE`, []);
        await app.close();
    });

    // getting all movies when no movies are present
    it('Should return an empty list', () => {
        return request(app.getHttpServer())
            .get('/movies/all')
            .expect(200)
            .expect([]);
    });

    // adding a movie
    it('should add a movie and return it with id field', async () => {
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
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('Interstellar');
            expect(response.body.genre).toBe('Sci-Fi');
            expect(response.body.duration).toBe(169);
            expect(response.body.rating).toBe(8.7);
            expect(response.body.releaseYear).toBe(2014);
    });

    // getting all movies when one movie is present
    it('should return a list containing one movie', async () => {
        const response = await request(app.getHttpServer())
            .get('/movies/all')
            .expect(200)
            expect(response.body).toEqual([{
                id: 1,
                title: 'Interstellar',
                genre: 'Sci-Fi',
                duration: 169,
                rating: 8.7,
                releaseYear: 2014
            }])
    });

    //updating a movie
    it('should update the movie\'s rating and return the updated one' , async () => {
        // changing rating from 8.7 to 10
        const response = await request(app.getHttpServer())
            .post('/movies/update/Interstellar')
            .send({
                title: 'Interstellar',
                genre: 'Sci-Fi',
                duration: 169,
                rating: 10,
                releaseYear: 2014
            })
            .expect(200)
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('Interstellar');
            expect(response.body.genre).toBe('Sci-Fi');
            expect(response.body.duration).toBe(169);
            expect(response.body.rating).toBe(10);
            expect(response.body.releaseYear).toBe(2014);
    });

    it('shoud return list of all movies', async () => {
        const response = await request(app.getHttpServer())
            .get('/movies/all')
            .expect(200)
        expect(response.body).toEqual([{
            id: 1,
            title: 'Interstellar',
            genre: 'Sci-Fi',
            duration: 169,
            rating: 10,
            releaseYear: 2014
        }]);
    });

    // Deleting a movie
    it('should delete movie', async () => {
        await request(app.getHttpServer())
            .delete('/movies/Interstellar')
            .expect(200);
    });

    // updating a deleted movie
    it('should return 404 for updating a non existend movie' , async () => {
        const response = await request(app.getHttpServer())
            .post('/movies/update/Interstellar')
            .send({
                title: 'Interstellar',
                genre: 'Sci-Fi',
                duration: 169,
                rating: 10,
                releaseYear: 2014
            })
            .expect(404)
    });

    // Deleting a non existing movie
    it('should return 404 for deleting a non existent movie', async () => {
        await request(app.getHttpServer())
            .delete('/movies/Interstellar')
            .expect(404);
    });

    it('trying to add movie)', async () => {
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
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('Interstellar');
            expect(response.body.genre).toBe('Sci-Fi');
            expect(response.body.duration).toBe(169);
            expect(response.body.rating).toBe(8.7);
            expect(response.body.releaseYear).toBe(2014);
    });
});