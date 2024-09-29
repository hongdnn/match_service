const TYPES = {
    //services
    IOrderService: Symbol.for('IOrderService'),
    ITransactionService: Symbol.for('ITransactionService'),

    //repositories
    IOrderRepository: Symbol.for('IOrderRepository'),
    ITransactionRepository: Symbol.for('ITransactionRepository'),
}

export { TYPES }