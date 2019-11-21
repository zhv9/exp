import { AsyncContainerModule } from 'inversify';
import { Repository } from 'typeorm';
import { TYPE } from './constants/types';
import { getDbConnection } from './db';
import { Movie } from './entity/Movie';
import { getMovieRepository } from './repositories/movie_repository';
import { Actor } from './entity/actor';
import { getActorRepository } from './repositories/actor_repository';

export const bindings = new AsyncContainerModule(async bind => {
  await getDbConnection();
  // import controller 来确保装饰器已经执行，这样就可以绑定了
  await require('./controller/movie_controller_with_inversify');
  await require("./controllers/actor_controller");
  bind<Repository<Movie>>(TYPE.MovieRepository)
    .toDynamicValue(() => {
      return getMovieRepository();
    })
    .inRequestScope();

  bind<Repository<Actor>>(TYPE.ActorRepository)
    .toDynamicValue(getActorRepository)
    .inRequestScope();
});
