# food-delivery

# Singleton 
Check mongoDB service getDb method to see singleton pattern illustrated.

# Builder
Check model/Order to see an implementation of a ConcreteBuilder\
! No Builder interface, since there are no interfaces in JS \
! No Director implemented, since it's optional. Check usage in routes/orders, can be seen as Director

# Decorator 
Check decorators in model directory\
They are built in different ways, so that you can compare different approaches\
https://addyosmani.com/blog/decorator-pattern/

# Facade 
mongoDbService over database operations

# Chain of responsibility 
Middlewares for ExpressJS
https://expressjs.com/en/guide/using-middleware.html
Check server.js file

# Command 
Check orderManager and foodDbService for implementation
Check routes/orders for usage

# Iterator 
Check utils/iterator, an iterator implemented with generator functions
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators

## Requirements to run the app 
- DB setup: https://www.knowi.com/blog/getting-started-with-mongodb-atlas-overview-and-tutorial/#tc3.1
- provide env values: https://www.twilio.com/blog/working-with-environment-variables-in-node-js-html