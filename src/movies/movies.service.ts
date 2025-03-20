import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db.service';
import { CreateMovieDto } from './create-movie.dto';

@Injectable()
export class MoviesService {
    constructor(private readonly databaseService: DatabaseService) {}

    async getAllMovies(): Promise<any> {
        const sql = 'SELECT * FROM movies;';
        const params = [];
        try {
            const result = await this.databaseService.query(sql, params);
            // console.log('result', result.rows);
            if (result.rows.length === 0) {
                return [];
            }
            return result.rows;
        }
        catch (error) {
            console.error('error getting all movies: ', error);
            throw new Error('Error getting all movies');
        }
    }

    async addMovie(movie: CreateMovieDto): Promise<any> {
        const sql = `
            INSERT INTO movies (title, genre, duration, rating, releaseYear)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const params = [movie.title, movie.genre, movie.duration, movie.rating, movie.releaseYear];
        try {
            const result = await this.databaseService.query(sql, params);
            console.log('Movie added');
            return result.rows[0];
        }
        catch (error) {
            console.error('Error adding movie: ', error);
            throw new Error('Error adding movie');
        }
    }

    async updateMovie(movie: CreateMovieDto) {
        const sql = `
            UPDATE movies
            SET genre = $2, duration = $3, rating = $4, releaseYear = $5
            WHERE title = $1
            RETURNING *;
        `
        const params = [movie.title, movie.genre, movie.duration, movie.rating, movie.releaseYear];
        try{
            const result = await this.databaseService.query(sql, params);
            if (result.rows.length === 0) {
                console.log('Movie not found');
            }
            else {
                console.log('Movie updated');
            }
        } catch (error) {
            console.error('Error updating movie: ', error);
            throw new Error('Error updating movie');
        }
    }

    async deleteMovie(movieTitle: string) {
        const sql = `
            DELETE FROM movies
            WHERE title = $1
        `
        const params = [movieTitle];
        try {
            await this.databaseService.query(sql, params);
            console.log('Movie deleted');
        } catch (error) {
            console.error('Error deleting movie: ', error);
            throw new Error('Error deleting movie');
        }
    }

}