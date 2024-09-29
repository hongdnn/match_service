import { Request, Response, Router } from "express"
import { myContainer } from "../../inversify.config"
import { TYPES } from "../../types"
import { IOrderService } from "../services/order.service"
import { Order } from "../../entities/order"
import { Transaction } from "../../entities/transaction"



export const orderRouter = Router()



const orderService: IOrderService = myContainer.get<IOrderService>(TYPES.IOrderService)

orderRouter.get('/', async (req: Request, res: Response) => {
    try {
        const result = await orderService.getOrders()
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ errors: error.errors })
    }
})

orderRouter.post('/matchExact', async (req: Request, res: Response) => {
    try {
        const orders = req.body.orders as Order[]
        const transactions = req.body.transactions as Transaction[]
        const result = await orderService.matchExact(orders, transactions)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ errors: error.errors })
    }
})


orderRouter.post('/match', async (req: Request, res: Response) => {
    try {
        const orders = req.body.orders as Order[]
        const transactions = req.body.transactions as Transaction[]
        const result = await orderService.match(orders, transactions)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ errors: error.errors })
    }
})



