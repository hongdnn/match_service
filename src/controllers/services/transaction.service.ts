import { inject, injectable } from "inversify"
import { TYPES } from "../../types"
import { ITransactionRepository } from "../../repositories/transaction.repository";
import { Transaction } from "../../entities/transaction";




export interface ITransactionService {
    getTransactions(): Promise<{ data: Transaction[] }>
}


@injectable()
export class TransactionService implements ITransactionService {
    @inject(TYPES.ITransactionRepository) private readonly _transactionRepo: ITransactionRepository

    public async getTransactions(): Promise<{ data: Transaction[] }> {
        const transactions = await this._transactionRepo.getAll()
        return { data: transactions }
    }
    
}