import "reflect-metadata"
import { Container } from "inversify";
import { OrderModel } from "./entities/order";
import { TYPES } from "./types";
import { IOrderService, OrderService } from "./controllers/services/order.service";
import { ITransactionService, TransactionService } from "./controllers/services/transaction.service";
import { ITransactionRepository, TransactionRepository } from "./repositories/transaction.repository";
import { TransactionModel } from "./entities/transaction";
import { IOrderRepository, OrderRepository } from "./repositories/order.repository";




const myContainer = new Container()

//services
myContainer.bind<IOrderService>(TYPES.IOrderService).to(OrderService)
myContainer.bind<ITransactionService>(TYPES.ITransactionService).to(TransactionService)


//repositories
myContainer.bind<ITransactionRepository>(TYPES.ITransactionRepository).toConstantValue(new TransactionRepository(TransactionModel))
myContainer.bind<IOrderRepository>(TYPES.IOrderRepository).toConstantValue(new OrderRepository(OrderModel))



export { myContainer }