import { Request, Response, Router } from "express"
import { myContainer } from "../../inversify.config"
import { TYPES } from "../../types"
import { ITransactionService } from "../services/transaction.service"



export const transactionRouter = Router()



const transactionService: ITransactionService = myContainer.get<ITransactionService>(TYPES.ITransactionService)

transactionRouter.get('/', async (req: Request, res: Response) => {
    try {
        const result = await transactionService.getTransactions()
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ errors: error.errors })
    }
})



