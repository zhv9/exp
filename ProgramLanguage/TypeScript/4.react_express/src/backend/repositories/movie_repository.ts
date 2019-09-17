import { getConnection } from "typeorm";

import { Movie } from "../entity/Movie";

export function getRepository() {
  const conn = getConnection();
  const movieRepository = conn.getRepository(Movie);
  return movieRepository;
}
