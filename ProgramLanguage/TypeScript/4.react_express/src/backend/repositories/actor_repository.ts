import { getConnection } from "typeorm";
import { Actor } from "../entity/actor";

export function getActorRepository() {
    const conn = getConnection();
    const movieRepository = conn.getRepository(Actor);
    return movieRepository;
}
