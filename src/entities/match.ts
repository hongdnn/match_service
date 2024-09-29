
import { Document, PaginateModel, Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export class Match {
    _id: string
    orderId: string
    transactionId: string
    status: string

}

const matchSchema = new Schema({
    orderId: {
        type: String,
        require: true
    },
    transactionId: {
        type: String,
        require: true
    },
    status: {
        type: String,
        default: null
    },
    date: {
        type: String,
        require: true
    }
})

matchSchema.index({ orderId: 1, transactionId: 1 })
matchSchema.plugin(paginate)

export const MatchModel = model<Match, PaginateModel<Document<Match>>>('match', matchSchema)