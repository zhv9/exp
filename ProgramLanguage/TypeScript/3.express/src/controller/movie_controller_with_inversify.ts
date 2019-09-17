import { Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  requestBody,
  requestParam,
  response,
  request
} from "inversify-express-utils";
import { Repository } from "typeorm";
import { TYPE } from "../constants/types";
import { Movie } from "../entity/Movie";
import { Request } from "express-serve-static-core";

@controller("/api/v2/movies")
export class MovieController {
  private readonly movieRepository: Repository<Movie>;
  public constructor(
    @inject(TYPE.MovieRepository)
    movieRepository: Repository<Movie>
  ) {
    this.movieRepository = movieRepository;
  }

  @httpGet("/")
  public async get(@response() res: Response) {
    try {
      return await this.movieRepository.find();
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
  }

  @httpGet("/:year")
  public async getByYear(
    @requestParam("year") yearPara: string,
    @response() res: Response
  ) {
    try {
      const year = parseInt(yearPara);
      return await this.movieRepository.find({ year });
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
  }

  @httpPost("/")
  public async post(@request() req: Request, @response() res: Response, @requestBody() newMovie: Movie) {
    if (
      typeof newMovie.title !== "string" ||
      typeof newMovie.year !== "number"
    ) {
      res.status(400);
      res.send(`Invalid Movie!`);
    }
    try {
      return await this.movieRepository.save(newMovie);
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
  }
}
