// if interfaces would be available, this should implement the same interface as Order
class VoucherDecorator {
    /**
     *
     * @param order
     */
    constructor(order) {
        this.order = order;
    }

    getCost() {
        console.log('Get cost in voucher decorator');
        let orderCost = this.order.getCost();
        // todo: create more relevant logic for determining discount, validate voucher expiration date, .etc
        const discount = parseInt(this.order.voucher.slice(-2));
        if (isNaN(discount)) {
            throw new Error('Order cost err. Invalid voucher');
        }
        return orderCost - discount/100 * orderCost;
    }
}

module.exports = VoucherDecorator;