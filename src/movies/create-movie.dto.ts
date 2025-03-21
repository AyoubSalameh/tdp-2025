import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateMovieDto {
    
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    genre: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    duration: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(10)
    rating: number;

    @IsNumber()
    @Max(new Date().getFullYear())
    releaseYear: number;
}

export class MovieResponseDto{

    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    genre: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    duration: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(10)
    rating: number;

    @IsNumber()
    @IsNotEmpty()
    @Max(new Date().getFullYear())
    releaseYear: number;
}