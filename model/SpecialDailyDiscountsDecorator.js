const SPECIAL_DISCOUNTS = {
    0: {
        name: 'Sunday Brunch',
        applyDiscount: cost => cost - 15/100 * cost,
    },
    2: {
        name: 'Tired Tuesday',
        applyDiscount: cost => cost - 30/100 * cost,
    }
}
/**
 * @param {Order} order
 */
module.exports = function SpecialDailyDiscountsDecorator(order) {
    const orderCost = order.getCost();

    order.getCost = function() {
        const today = new Date().getDay();
        const discount = SPECIAL_DISCOUNTS[today];
        if (!discount) {
            return orderCost;
        } else {
            console.log(`Applying discount ${discount.name}`);
            return discount.applyDiscount(orderCost);
        }
    }
}