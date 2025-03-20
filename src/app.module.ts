import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//added
import { DatabaseService } from './db.service';
import { MoviesService } from './movies/movies.service';
import { MoviesController } from './movies/movies.controller';

@Module({
  imports: [],
  controllers: [AppController, MoviesController],
  providers: [AppService, DatabaseService, MoviesService ],
})
export class AppModule {}
