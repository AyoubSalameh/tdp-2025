//TODO: add validation to the fields

export class CreateMovieDto {
    title: string;
    genre: string;
    duration: number;
    rating: number;
    releaseYear: number;
}

export class MovieResponseDto{
    id: number;
    title: string;
    genre: string;
    duration: number;
    rating: number;
    releaseYear: number;
}