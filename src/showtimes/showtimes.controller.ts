import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, Delete, HttpException } from "@nestjs/common";
import { CreateShowtimeDto, ShowtimeResponseDto } from "./create-showtime.dto";
import { ShowtimesService } from "./showtimes.service";

@Controller('showtimes')
export class ShowtimesController {

    constructor(private readonly showtimesService: ShowtimesService) {}

    @Get('all')
    getAllShowtimes(): Promise<CreateShowtimeDto[]> {
        try {
            console.log('getting all showtimes');
            return this.showtimesService.getAllShowtimes();
        } catch (error) {
            throw new Error('Error getting all showtimes');
        }
    }

    @Get(':showtimeId')
    getShowtimeById(@Param('showtimeId') showtimeId: string): Promise<ShowtimeResponseDto> {
        try {
            return this.showtimesService.getShowtimeById(showtimeId);
        } catch (error) {
            throw new Error('Error getting showtime by id');
        }
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    addShowtime(@Body() showtime: CreateShowtimeDto): Promise<ShowtimeResponseDto> {
        try {
            return this.showtimesService.addShowtime(showtime);
        } catch (error) {
            throw new Error('Error adding showtime');
        }
    }

    @Post('update/:showtimeId')
    @HttpCode(HttpStatus.OK)
    async updateShowtime(
        @Param('showtimeId') showtimeId: string,
        @Body() showtime: CreateShowtimeDto) {
        try {
            await this.showtimesService.updateShowtime(showtimeId, showtime);
        } catch (error) {
            //throw new Error('Error updating showtime');
            throw new HttpException('Error updating showtime', HttpStatus.BAD_REQUEST);
        }
    }
    
    @Delete(':showtimeId')
    @HttpCode(HttpStatus.OK)
    async deleteShowtime(@Param('showtimeId') showtimeId: string) {
        try {
            await this.showtimesService.deleteShowtime(showtimeId);
        } catch (error) {
            throw new Error('Error deleting showtime');
        }
    }

}
