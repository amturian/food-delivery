const foodDbService = require('../services/foodDbService.js');
const getObjectId = foodDbService.getObjectId;

async function addOrder(order) {
    const {id: orderId} = await foodDbService.insertOne('orders', order);
    return orderId;
}

async function updateOrder(orderId, updates) {
    await foodDbService.updateOne(
        'orders',
        { _id: getObjectId(orderId) },
        updates
    );
}

async function getAllOrders() {
    return await foodDbService.find('orders', {});
}

module.exports = {
    addOrder,
    updateOrder,
    getAllOrders,
};