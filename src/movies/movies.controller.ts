import { Controller, Get, Post, Body, HttpCode, HttpStatus, Delete, Param, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto, MovieResponseDto } from './create-movie.dto';
import e from 'express';

//all endpoints start with movies
@Controller('movies')
export class MoviesController {

    constructor(private readonly moviesService: MoviesService) {}

    @Get('all')
    getAllMovies(): Promise<MovieResponseDto[]> {
        return this.moviesService.getAllMovies();
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    addMovie(@Body() movie: CreateMovieDto): Promise<MovieResponseDto> {
        return this.moviesService.addMovie(movie);
        
    }

    @Post('update/:movieTitle')
    @HttpCode(HttpStatus.OK)
    updateMovie(@Body() movie: CreateMovieDto){
        return this.moviesService.updateMovie(movie);
    }

    @Delete(':movieTitle')
    deleteMovie(@Param('movieTitle') movieTitle: string) {
        const decoded = decodeURIComponent(movieTitle.replace(/\+/g, ' '));
        return this.moviesService.deleteMovie(decoded);
    }

}