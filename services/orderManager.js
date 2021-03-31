const ordersRepo = require('../repositories/orders');

class OrderManager {
    async getOrders() {
        console.log('Retrieving all orders...');
        return await ordersRepo.getAllOrders();
    }

    async placeOrder(order) {
        console.log('Placing the following order...');
        const orderId = await ordersRepo.addOrder(order);
        console.log('OrderID', orderId);
        return orderId;
    }

    async cancelOrder(orderId) {
        console.log('Cancelling order with id', orderId);
        await ordersRepo.updateOrder(orderId, { status: 'CANCELLED' });
    }

    execute(name, ...args) {
        console.log('Executing command:', name);
        return this[name] && this[name].apply(this, args);
    }
}

module.exports = OrderManager;