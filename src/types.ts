const TYPES = {
    //services
    IOrderService: Symbol.for('IOrderService'),
    ITransactionService: Symbol.for('ITransactionService'),
    IMatchService: Symbol.for('IMatchService'),

    //repositories
    IOrderRepository: Symbol.for('IOrderRepository'),
    ITransactionRepository: Symbol.for('ITransactionRepository'),
    IMatchRepository: Symbol.for('IMatchRepository'),
}

export { TYPES }