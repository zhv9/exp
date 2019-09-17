import { AsyncContainerModule } from "inversify";
import { Repository } from "typeorm";
import { TYPE } from "./constants/types";
import { getDbConnection } from "./db";
import { Movie } from "./entity/Movie";
import { getRepository } from "./repositories/movie_repository";

export const bindings = new AsyncContainerModule(async bind => {
  await getDbConnection();
  await require("./controller/movie_controller_with_inversify");
  bind<Repository<Movie>>(TYPE.MovieRepository)
    .toDynamicValue(() => {
      return getRepository();
    })
    .inRequestScope();
});
