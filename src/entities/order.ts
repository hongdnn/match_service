
import { Document, PaginateModel, Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export class Order {
    _id: string
    type: string
    customerName: string
    orderId: string
    date: string
    product: string
    price: number

    constructor(dto: any){
        this._id = dto._id
        this.type = dto.type
        this.customerName = dto.customerName
        this.orderId = dto.orderId
        this.date = dto.date
        this.product = dto.product
        this.price = dto.price
    }
}

const orderSchema = new Schema({
    type: {
        type: String,
        default: 'order'
    },
    customerName: {
        type: String,
        require: true
    },
    orderId: {
        type: String,
        default: null
    },
    date: {
        type: String,
        require: true
    },
    product: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
})

orderSchema.plugin(paginate)

export const OrderModel = model<Order, PaginateModel<Document<Order>>>('order', orderSchema)