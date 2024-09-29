import { injectable } from "inversify";
import { BaseRepository, IBaseRepository } from "./base.repository";
import { Transaction } from "../entities/transaction";


export interface ITransactionRepository extends IBaseRepository<Transaction> {
    
}

@injectable()
export class TransactionRepository extends BaseRepository<Transaction> implements ITransactionRepository {

}