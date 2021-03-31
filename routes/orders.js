const express = require('express');
const router = express.Router();

const Order = require('../model/Order');
const VoucherDecorator = require('../model/VoucherDecorator');
const SpecialDailyDiscountsDecorator = require('../model/SpecialDailyDiscountsDecorator');
const OrderManager = require('../services/orderManager');
const iterator = require('../utils/iterator');

const orderManager = new OrderManager();

router.get('/', async (req, res) => {
   const orders = await orderManager.getOrders();
   res.send(orders);

   // supposing we would like GET ALL to return only orders that are not cancelled, using an iterator
   // iterator is implemented with generator functions
   // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
   const iteratorWithGenerator = iterator(orders, order => order.status !== 'CANCELLED');
   console.log(iteratorWithGenerator.next());
   console.log(iteratorWithGenerator.next());
   console.log(iteratorWithGenerator.next());
   console.log(iteratorWithGenerator.next());
});

router.post('/', async (req, res) => {
   let order = createOrder(req.body);
   // example 1 decorator
   SpecialDailyDiscountsDecorator(order);
   const {voucher} = req.body;
   if (voucher) {
      // example 2 decorator
      order = new VoucherDecorator(order);
   }
   const cost = order.getCost();
   console.log('Computed cost', cost);

   const orderId = await orderManager.execute('placeOrder', {...order, cost});

   res.send({orderId});
});

router.patch('/:orderId', async (req, res) => {
   const { orderId } = req.params;

   await orderManager.execute('cancelOrder', orderId);

   res.sendStatus(200);
});

// can be seen as a Director
// docs: https://refactoring.guru/design-patterns/builder
/**
 *
 * @param address
 * @param {FoodItems} dishes
 * @param {string} voucher
 * @return {Order}
 */
function createOrder({address, dishes, voucher}) {
   const order = new Order()
       .setAddress(address)
       .setFoodItems(dishes)
       .setVoucher(voucher);

   return order.getOrder();
}

module.exports = router;