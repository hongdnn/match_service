import { inject, injectable } from "inversify"
import { TYPES } from "../../types";
import { IOrderRepository } from "../../repositories/order.repository";
import { Order } from "../../entities/order";
import { Transaction } from "../../entities/transaction";
import { IMatchRepository } from "../../repositories/match.repository";



export interface IOrderService {
    getOrders(): Promise<{ data: Order[] }>
    matchExact(orders: Order[], transactions: Transaction[]): Promise<{ data: any }>
    match(orders: Order[], transactions: Transaction[]): Promise<{ data: any }>
}


@injectable()
export class OrderService implements IOrderService {

    @inject(TYPES.IOrderRepository) private readonly _orderRepo: IOrderRepository
    @inject(TYPES.IMatchRepository) private readonly _matchRepo: IMatchRepository

    public async getOrders(): Promise<{ data: Order[] }> {
        const orders = await this._orderRepo.getAll()
        return { data: orders }
    }

    public async matchExact(orders: Order[], transactions: Transaction[]): Promise<{ data: any; }> {
        const map = new Map()
        const matchedTransactions = new Set()

        for (let order of orders) {
            for (let transaction of transactions) {
                if (matchedTransactions.has(transaction._id)) {
                    continue
                }
                if (order.customerName === transaction.customerName &&
                    order.orderId === transaction.orderId &&
                    order.date === transaction.date &&
                    order.product === transaction.product &&
                    order.price === transaction.price) {
                    if (!map.get(order.orderId)) {
                        const array = [order, transaction]
                        map.set(order.orderId, array)
                    } else {
                        const array = map.get(order.orderId)
                        array.push(transaction);
                        map.set(order.orderId, array)
                    }
                    matchedTransactions.add(transaction._id)
                }
            }
        }

        return { data: Array.from(map.values()) }
    }

    public async match(orders: Order[], transactions: Transaction[]): Promise<{ data: any; }> {
        const map = new Map()

        const orderIds = orders.map(order => order._id)
        const transactionIds = transactions.map(transaction => transaction._id)

        const existedMatches = await this._matchRepo.findByCondition({
            orderId: { $in: orderIds },
            transactionId: { $in: transactionIds }
        })

        const matchesMap = new Map(
            existedMatches.map(match => [`${match.orderId}-${match.transactionId}`, match.status])
        );

        for (let order of orders) {
            for (let transaction of transactions) {
                // check if user confirmed/rejected this match
                if (matchesMap.get(`${order._id}-${transaction._id}`) === 'rejected') continue
                else if (matchesMap.get(`${order._id}-${transaction._id}`) === 'confirmed') {
                    let txn = { ...transaction, status: 'confirmed' }
                    if (!map.get(order.orderId)) {
                        const array = [order, txn]
                        map.set(order.orderId, array)
                    } else {
                        const array = map.get(order.orderId)
                        array.push(txn);
                        map.set(order.orderId, array)
                    }
                }
                // else, compare texts of order information and transaction information
                else {
                    const customerNameRatio = this.compareTexts(order.customerName, transaction.customerName)
                    const orderIdRatio = this.compareTexts(order.orderId, transaction.orderId)
                    const productRatio = this.compareTexts(order.product, transaction.product)

                    // if one of the data is too different, consider this order and transaction are not match
                    if (customerNameRatio < 30 || orderIdRatio < 30 || productRatio < 30) continue
                    const overallRatio = Math.round((customerNameRatio + orderIdRatio + productRatio) / 3)

                    //assuming the overall ratio of same texts should be at least 60%
                    if (overallRatio >= 60) {
                        let txn = { ...transaction, ratio: overallRatio }
                        if (!map.get(order.orderId)) {
                            const array = [order, txn]
                            map.set(order.orderId, array)
                        } else {
                            const array = map.get(order.orderId)
                            array.push(txn);
                            map.set(order.orderId, array)
                        }
                    }
                }
            }
        }

        return { data: Array.from(map.values()) }
    }

    // Compare the number of same words + characters in 2 strings to calculate ratio
    compareTexts(text1: string, text2: string): number {
        if (text1 === text2) return 100
        let l1 = text1.length
        let l2 = text2.length

        // when compare array of words, remove the number of spaces in the strings
        let words1 = text1.split(' ')
        l1 -= words1.length - 1
        let words2 = text2.split(' ')
        l2 -= words2.length - 1

        // Exclude duplicate words in each string, assume that user type duplicate words by mistake
        let wordSet1 = new Set<string>()
        words1.forEach(word => {
            if (wordSet1.has(word)) {
                l1 -= word.length
            } else {
                wordSet1.add(word)
            }
        })
        let wordSet2 = new Set<string>()
        words2.forEach(word => {
            if (wordSet2.has(word)) {
                l2 -= word.length
            } else {
                wordSet2.add(word)
            }
        })

        // Get the max length between 2 strings to calculate ratio later
        const maxLength = l1 > l2 ? l1 : l2
        words2 = Array.from(wordSet2)
        let matchCharCount = 0
        // Count the same words' length
        for (let word in words2) {
            if (wordSet1.has(word)) {
                matchCharCount += word.length
                wordSet1.delete(word)
                wordSet2.delete(word)
            }
        }

        // compare characters in remaining words
        const remainString1 = Array.from(wordSet1).join('')
        const remainString2 = Array.from(wordSet2).join('')
        const charMap1 = new Map();

        for (let char of remainString1) {
            charMap1.set(char, (charMap1.get(char) || 0) + 1)
        }
        for (let char of remainString2) {
            if (charMap1.get(char) !== undefined) {
                if (charMap1.get(char) > 0) {
                    matchCharCount++
                    charMap1.set(char, charMap1.get(char) - 1)
                }
            }
        }
        let result = Math.round(matchCharCount / maxLength * 100)
        // 95% means the order of words inside 2 strings are not the same
        if (result === 100) result -= 5
        return result
    }
}