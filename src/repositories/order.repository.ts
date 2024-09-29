import { injectable } from "inversify";
import { BaseRepository, IBaseRepository } from "./base.repository";
import { Order } from "../entities/order";


export interface IOrderRepository extends IBaseRepository<Order> {
    
}

@injectable()
export class OrderRepository extends BaseRepository<Order> implements IOrderRepository {

}