import { Test, TestingModule } from '@nestjs/testing';
import { MovieResponseDto, CreateMovieDto } from "../movies/create-movie.dto";
import { MoviesService } from "../movies/movies.service";
import { DatabaseService } from "../db.service";
import { query } from 'express';
import { mock } from 'node:test';
import exp from 'constants';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {

    let service: MoviesService;
    let db: DatabaseService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                MoviesService,
                {
                    provide: DatabaseService,
                    useValue: {query: jest.fn()}
                }
            ],
        }).compile();

        service = module.get<MoviesService>(MoviesService);
        db = module.get<DatabaseService>(DatabaseService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    const movie: CreateMovieDto = {
        title: 'Interstellar',
        genre: 'Sci-Fi',
        duration: 169,
        rating: 8.7,
        releaseYear: 2014
    }

    const movieResponse: MovieResponseDto = {
        id: 1,
        title: 'Interstellar',
        genre: 'Sci-Fi',
        duration: 169,
        rating: 8.7,
        releaseYear: 2014
    }

    //testing GET - getAllMovies
    describe('getAllMovies', () => {
        it('should return all movies', async () => {
            db.query = jest.fn().mockResolvedValue({rows: [movieResponse]});
            const result = await service.getAllMovies();
            expect(result).toEqual([movieResponse]);
        });

        it('should return empty array if no movies were added', async () => {
            db.query = jest.fn().mockResolvedValue({rows: []});
            const result = await service.getAllMovies();
            expect(result).toEqual([]);
        });
    });

    //testing POST - addMovie
    describe('addMovie', () => {

        const InvalidMovie: CreateMovieDto = {
            title: 'Interstellar',
            genre: '',
            duration: -169,
            rating: 8.7,
            releaseYear: 2014
        }

        it('should add a movie', async ()=> {
            db.query = jest.fn().mockResolvedValue({rows: [movieResponse]});
            const result = await service.addMovie(movie);
            expect(result).toEqual(movieResponse);
        })

        it('should throw an error if the movie is invalid', async () => {
            try {
                await service.addMovie(InvalidMovie);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        });
    });

    //testing POST - updateMovie
    describe('updateMovie', () => {
        const updatedMovie = {...movie, title: 'Inception'};
        const updatedMovieResponse = {...movieResponse, title: 'Inception'};
        it('should update a movie', async () => {
            db.query = jest.fn().mockResolvedValue({rows: [updatedMovieResponse]});
            const result = await service.updateMovie('Interstellar', updatedMovie);
            expect(result).toEqual(updatedMovieResponse);
        });

        it('should return the updated movie', async () => {
            db.query = jest.fn().mockResolvedValue({rows: [updatedMovieResponse]});
            const result = await service.updateMovie('Interstellar', updatedMovie);
            expect(result).toEqual(updatedMovieResponse);
        });

        it('should throw an error if the movie is not found', async () => {
            db.query = jest.fn().mockResolvedValue({rows: []});
            await expect(service.updateMovie('Interstellar', updatedMovie))
            .rejects.toThrow(NotFoundException);
        });
    });

    //testing DELETE - deleteMovie
    describe('deleteMovie', () => {
        it('should delete a movie', async () => {
            db.query = jest.fn().mockResolvedValue({rows: [movieResponse]});
            const result = await service.deleteMovie('Interstellar');
            expect(result).toBeUndefined();
        });

        it('should throw an error if the movie is not found', async () => {
            db.query = jest.fn().mockResolvedValue({rowCount: 0});
            await expect(service.deleteMovie('Interstellar'))
            .rejects.toThrow(NotFoundException);
        });
    });

});