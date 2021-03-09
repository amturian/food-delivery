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

## Requirements to run the app 
- DB setup: https://www.knowi.com/blog/getting-started-with-mongodb-atlas-overview-and-tutorial/#tc3.1
- provide env values: https://www.twilio.com/blog/working-with-environment-variables-in-node-js-html