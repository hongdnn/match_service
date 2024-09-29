import { inject, injectable } from "inversify"
import { TYPES } from "../../types"
import { IMatchRepository } from "../../repositories/match.repository";
import { Match } from "../../entities/match";




export interface IMatchService {
    confirmMatch(orderId: string, transactionId: string, status: string): Promise<{ data: Match }>
}


@injectable()
export class MatchService implements IMatchService {
    @inject(TYPES.IMatchRepository) private readonly _transactionRepo: IMatchRepository

    public async confirmMatch(orderId: string, transactionId: string, status: string): Promise<{ data: Match }> {
        let result: Match
        const checkMatch = await this._transactionRepo.findByCondition({ orderId: orderId, transactionId: transactionId })
        if(checkMatch.length !== 0) {
            result = await this._transactionRepo.update(checkMatch[0]._id, { status: status })
        } else {
            const newMatch = new Match()
            newMatch.orderId = orderId
            newMatch.transactionId = transactionId
            newMatch.status = status
            result = await this._transactionRepo.create(newMatch)
        }
        return { data: result }
    }
    
}