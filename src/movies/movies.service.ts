import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../db.service';
import { CreateMovieDto, MovieResponseDto } from './create-movie.dto';

@Injectable()
export class MoviesService {
    constructor(private readonly databaseService: DatabaseService) {}

    async getAllMovies(): Promise<MovieResponseDto[]> {
        const sql = 'SELECT * FROM movies;';
        const params = [];
        const result = await this.databaseService.query(sql, params);
        if (result.rows.length === 0) {
            return [];
        }
        return result.rows as MovieResponseDto[];
    }

    async addMovie(movie: CreateMovieDto): Promise<MovieResponseDto> {
        const sql = `
            INSERT INTO movies (title, genre, duration, rating, releaseYear)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const params = [movie.title, movie.genre, movie.duration, movie.rating, movie.releaseYear];
        const result = await this.databaseService.query(sql, params);
        console.log('Movie added');
        return result.rows[0] as MovieResponseDto;
    
    }

    //returns 404 if movie not found
    async updateMovie(originalTitle: string, movie: CreateMovieDto) {
        const sql = `
            UPDATE movies
            SET title = $2, genre = $3, duration = $4, rating = $5, releaseYear = $6
            WHERE title = $1
            RETURNING *;
        `
        const params = [originalTitle, movie.title, movie.genre, movie.duration, movie.rating, movie.releaseYear];
        const result = await this.databaseService.query(sql, params);
        if (result.rows.length === 0) {
            throw new NotFoundException(`Movie not found`);
        }
    
        return result.rows[0];
    }

    async deleteMovie(movieTitle: string) {
        const sql = `
            DELETE FROM movies
            WHERE title = $1
        `;
        const params = [movieTitle];
        const result = await this.databaseService.query(sql, params);
        if (result.rowCount === 0) {
            throw new NotFoundException(`Movie with title "${movieTitle}" not found`);
        }
        console.log('Movie deleted');
        
    }

}