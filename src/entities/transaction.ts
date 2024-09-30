
import { Document, PaginateModel, Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export class Transaction {
    _id: string
    type: string
    customerName: string
    orderId: string
    date: string
    product: string
    price: number
    transactionType: string
    transactionDate: string
    transactionAmount: number
    overall: number
    
}

const transactionSchema = new Schema({
    type: {
        type: String,
        default: 'txn'
    },
    customerName: {
        type: String,
        require: true
    },
    orderId: {
        type: String,
        require: true
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
    transactionType: {
        type: String,
        require: true
    },
    transactionDate: {
        type: String,
        required: true
    },
    transactionAmount: {
        type: Number,
        required: true
    }
})

transactionSchema.plugin(paginate)

export const TransactionModel = model<Transaction, PaginateModel<Document<Transaction>>>('transaction', transactionSchema)