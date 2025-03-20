import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//added
import { DatabaseService } from './db.service';
import { MoviesService } from './movies/movies.service';
import { MoviesController } from './movies/movies.controller';
import { ShowtimesService } from './showtimes/showtimes.service';
import { ShowtimesController } from './showtimes/showtimes.controller';

@Module({
  imports: [],
  controllers: [AppController, MoviesController, ShowtimesController],
  providers: [AppService, DatabaseService, MoviesService, ShowtimesService ],
})
export class AppModule {}
