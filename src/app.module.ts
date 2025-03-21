import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//added
import { DatabaseService } from './db.service';
import { MoviesService } from './movies/movies.service';
import { MoviesController } from './movies/movies.controller';
import { ShowtimesService } from './showtimes/showtimes.service';
import { ShowtimesController } from './showtimes/showtimes.controller';
import { BookingsService } from './bookings/bookings.service';
import { BookingsController } from './bookings/bookings.controller';

@Module({
  imports: [],
  controllers: [AppController, MoviesController, ShowtimesController, BookingsController],
  providers: [AppService, DatabaseService, MoviesService, ShowtimesService, BookingsService ],
})
export class AppModule {}
