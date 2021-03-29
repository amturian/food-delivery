const foodDbService = require('./foodDbService.js');
const getObjectId = foodDbService.getObjectId;

class OrderManager {
    async placeOrder(order) {
        console.log('Placing the following order...');
        const {id: orderId} = await foodDbService.insertOne('orders', order);
        console.log('OrderID', orderId);
        return orderId;
    }

    async cancelOrder(orderId) {
        console.log('Cancelling order with id', orderId);
        await foodDbService.updateOne(
            'orders',
            { _id: getObjectId(orderId) },
            {status: 'CANCELLED'}
        );
    }

    execute(name, ...args) {
        console.log('Executing command:', name);
        return this[name] && this[name].apply(this, args);
    }
}

module.exports = OrderManager;