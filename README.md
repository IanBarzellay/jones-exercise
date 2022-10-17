# jones-exercise
Using nodejs server with mongodb database.

First, download and run in the terminal
`$ npm install`

After install all the packages, run 
`$ npm start` 
to start the application.

The server will run on `http://localhost:8080`

For unit tests, run in the terminal `$ npm test` 



About The Exercise
-------------
First I will add option to add products to mongodb for dummy data for order building.

![](https://i.imgur.com/UMzMjUE.png)

To add new product you can send POST request to `http://localhost:8080/restaurant/add-product`
with JSON data like:
```javascript
{
    "title": String,
    "price" : Number,
    "description": String
}
```

Save New Order
-----
By sending POST request to `http://localhost:8080/orders/`
with JSON data like:
```javascript
{
    "customerName": String,
    "customerAddress": String,
    "customerPhoneNumber": String,
    "products": [
        {
        "product": product id,
        "quantity": Number,
        "note": String
        }
    ]
}
```
we add new order into mongodb database with extra data - id, createdAt, updatedAt, and totalPrice.
I alredy add some dummy data:

![](https://i.imgur.com/XTtVrz4.png)



Get all orders from the last day, last week and last month
-----
By sending GET request to `http://localhost:8080/orders/period/:period`, where period need to be "day" or "week" or "month".



Get Order
-----
By sending GET request to `http://localhost:8080/orders/:orderId`, where orderId is a product Is found in MongoDB.

Change Order (only if 15 minutes passed from when it was ordered)
-----
By sending PATCH request to ` http://localhost:8080/orders/:orderId`, where orderId is a product Is found in MongoDB. and JSON body of the order.

