import { Controller, Get, Post, Body, HttpCode, HttpStatus, Delete, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './create-movie.dto';

//alll endpoints start with movies
@Controller('movies')
export class MoviesController {

    constructor(private readonly moviesService: MoviesService) {}

    @Get('all')
    getAllMovies(): Promise<any> {
        try{
            return this.moviesService.getAllMovies();
        } catch (error) {
            throw new Error('Error getting all movies');
        }
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    addMovie(@Body() movie: CreateMovieDto): Promise<CreateMovieDto> {
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