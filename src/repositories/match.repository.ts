import { injectable } from "inversify";
import { BaseRepository, IBaseRepository } from "./base.repository";
import { Match } from "../entities/match";


export interface IMatchRepository extends IBaseRepository<Match> {
    
}

@injectable()
export class MatchRepository extends BaseRepository<Match> implements IMatchRepository {
    
}