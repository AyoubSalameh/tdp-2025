import { IsNumber, IsNotEmpty, IsString, IsDateString } from "class-validator";

export class CreateShowtimeDto {

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    movieId: number;

    @IsString()
    @IsNotEmpty()
    theater: string;

    @IsDateString()
    @IsNotEmpty()
    startTime: Date;

    @IsDateString()
    @IsNotEmpty()
    endTime: Date;
}

export class ShowtimeResponseDto {

    @IsNumber()
    @IsNotEmpty()
    id: number;
    
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    movieId: number;

    @IsString()
    @IsNotEmpty()
    theater: string;

    @IsDateString()
    @IsNotEmpty()
    startTime: Date;

    @IsDateString()
    @IsNotEmpty()
    endTime: Date;
}