import { Router } from "express";
import { getMovieRepository } from "../repositories/movie_repository";
import { Movie } from "../Entity/Movie";

const movieRouter = Router();

movieRouter.get("/", function(req, res) {
  const movieRepository = getMovieRepository();
  movieRepository
    .find()
    .then(movies => {
      res.json(movies);
    })
    .catch((e: Error) => {
      res.status(500);
      res.send(e.message);
    });
});

movieRouter.get("/:year", function(req, res) {
  const movieRepository = getMovieRepository();
  movieRepository
    .find({ year: Number(req.params.year) })
    .then(movies => {
      res.json(movies);
    })
    .catch((e: Error) => {
      res.status(500);
      res.send(e.message);
    });
});

movieRouter.post("/", async function(req, res) {
  const movieRepository = getMovieRepository();
  const newMovie = req.body;

  if (typeof newMovie.title !== "string" || typeof newMovie.year !== "number") {
    res.status(400);
    res.send(`Invalid Movie!`);
  }
  try {
    const response = await movieRepository.save(newMovie);
    res.send(response);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
});

export { movieRouter };
