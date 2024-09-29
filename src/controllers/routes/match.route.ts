import { Request, Response, Router } from "express"
import { myContainer } from "../../inversify.config"
import { TYPES } from "../../types"
import { ITransactionService } from "../services/transaction.service"
import { IMatchService } from "../services/match.service"



export const matchRouter = Router()



const matchService: IMatchService = myContainer.get<IMatchService>(TYPES.IMatchService)

matchRouter.post('/confirm', async (req: Request, res: Response) => {
    try {
        const dto = req.body
        const result = await matchService.confirmMatch(dto.orderId, dto.transactionId, dto.status)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ errors: error.errors })
    }
})



