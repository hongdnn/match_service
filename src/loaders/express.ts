import express from 'express'
import cors from 'cors'
import { errors } from 'celebrate'
import { orderRouter } from '../controllers/routes/order.route'
import { transactionRouter } from '../controllers/routes/transaction.route'

export class ExpressLoader {
    constructor() {}

    configExpress(app) {
        app.use(express.json())
        app.use(cors()) 
        
        app.use('/orders', orderRouter)
        app.use('/transactions', transactionRouter)

        app.use(errors())

        app.get('/', (req, res) => res.send('Test match service'))
    }
}