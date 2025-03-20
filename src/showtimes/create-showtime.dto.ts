export class CreateShowtimeDto {
    price: number;
    movieId: number;
    theater: string;
    startTime: Date;
    endTime: Date;
}

export class ShowtimeResponseDto {
    id: number;
    price: number;
    movieId: number;
    theater: string;
    startTime: Date;
    endTime: Date;
}