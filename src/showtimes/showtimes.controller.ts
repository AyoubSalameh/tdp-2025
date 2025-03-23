import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, Delete, HttpException } from "@nestjs/common";
import { CreateShowtimeDto, ShowtimeResponseDto } from "./create-showtime.dto";
import { ShowtimesService } from "./showtimes.service";

@Controller('showtimes')
export class ShowtimesController {

    constructor(private readonly showtimesService: ShowtimesService) {}

    @Get('all')
    getAllShowtimes(): Promise<ShowtimeResponseDto[]> {
        return this.showtimesService.getAllShowtimes();
    }

    @Get(':showtimeId')
    getShowtimeById(@Param('showtimeId') showtimeId: number): Promise<ShowtimeResponseDto> {
        return this.showtimesService.getShowtimeById(showtimeId);    
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    addShowtime(@Body() showtime: CreateShowtimeDto): Promise<ShowtimeResponseDto> {
        return this.showtimesService.addShowtime(showtime);
    }

    @Post('update/:showtimeId')
    @HttpCode(HttpStatus.OK)
    async updateShowtime(
        @Param('showtimeId') showtimeId: number,
        @Body() showtime: CreateShowtimeDto) {
        await this.showtimesService.updateShowtime(showtimeId, showtime);  
    }
    
    @Delete(':showtimeId')
    @HttpCode(HttpStatus.OK)
    async deleteShowtime(@Param('showtimeId') showtimeId: number) {
        await this.showtimesService.deleteShowtime(showtimeId);
    }
}
