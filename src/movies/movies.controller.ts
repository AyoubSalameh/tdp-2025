import { Controller, Get, Post, Body, HttpCode, HttpStatus, Delete, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto, MovieResponseDto } from './create-movie.dto';

//all endpoints start with movies
@Controller('movies')
export class MoviesController {

    constructor(private readonly moviesService: MoviesService) {}

    @Get('all')
    getAllMovies(): Promise<MovieResponseDto[]> {
        try{
            return this.moviesService.getAllMovies();
        } catch (error) {
            throw new Error('Error getting all movies');
        }
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    addMovie(@Body() movie: CreateMovieDto): Promise<MovieResponseDto> {
        try {
            return this.moviesService.addMovie(movie);
        } catch (error) {
            throw new Error('Error adding movie');
        }
    }

    @Post('update/:movieTitle')
    @HttpCode(HttpStatus.OK)
    updateMovie(@Body() movie: CreateMovieDto){
        try { 
            console.log(movie);
            this.moviesService.updateMovie(movie);
        } catch (error) {
            throw new Error('Error updating movie');
        }
    }

    @Delete(':movieTitle')
    deleteMovie(@Param('movieTitle') movieTitle: string) {
        try {
            this.moviesService.deleteMovie(movieTitle);
        } catch (error) {
            throw new Error('Error deleting Movie');
        }
    }

}