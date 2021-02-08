const express = require('express');
const router = express.Router();

const Order = require('../model/Order');
const foodDbService = require('../services/foodDbService.js');

router.get('/', (req, res) =>
    res.send('Hello from router')
);

router.post('/', async (req, res) => {
   const order = createOrder(req.body);
   const {id: orderId} = await foodDbService.insertOne('orders', order);

   res.send({orderId});
});

// can be seen as a Director
// docs: https://refactoring.guru/design-patterns/builder
function createOrder({address, dishes}) {
   const order = new Order()
       .setAddress(address)
       .setFoodItems(dishes);

   return order.getOrder();
}

module.exports = router;