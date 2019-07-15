# "Bamazon" Shopping

Bamazon is a command line app where the user interacts with items in the Bamazon database.

## Bamazon Customer

To shop, the user enters: `node bamazonCustomer`. A menu is displayed by Inquirer, where the user has the ability to either view all of the items for sale, view items in each department, or exit the application.

* If `View All Items` is selected, each item listed in the `products` table of the `bamazon_db` are listed along with the price. When the user selects an item, the `item_id` is then returned in order to run a query.
* After, an inquirer prompt is then displayed to ask the quantity to purchase.
* If there is enough quantity in stock, then the purchase is made.
* The database is updated to reflect the change in quantity and total sales for the product purched.

* If `View By Department` is selected, then only the items in department that the user chooses is displayed. The buying process is the same.

<img src="readmePhotos/customer.gif"> 

## Bamazon Manager

To utilize the manager app, the user enters `node bamazonManager`.  A menu is displayed by Inquirer, where the user is able to either view all products for sale, view low inventory, add inventory to current items, add a new item, or exit the application.

* If `View Products For Sale` is selected, then the table of all of the current products for sale are displayed.
* If `View Low Inventory` is selected, then all of the items with inventory less than 50 items are displayed on a table.
* If `Add To Inventory` is selected, then a list of all of the inventory is displayed to be selected. Once an item is selected, then the user is prompted to enter the quantity. The quantity is then added onto the inventory that was there before.
* If `Add New Product` is selected, then the user is prompted to enter all of the necessary information to insert the product into the database.

<img src="readmePhotos/manager.gif">

## Bamazon Supervisor

To utilize the manager app, the user enters `node bamazonSupervisor`.  A menu is displayed by Inquirer, where the user is able to either view all products sales by department, add a new department, or exit the application.

* If `View Product Sales By Department` is selected, then the user is prompted to choose which department to view. A table is then generated to show the sum of all the product sales in the chosen department, the overhead costs, and the total profit (the difference between the overhead costs and sum). Both of the `product_sales` and `total_profit` are dynamically generated and labeled as aliases.
* If `Create New Department` is selected, then the user is prompted to enter the new department name and the overhead costs.
* If the new department is chosen to be viewed before an item is added, a message will be sent to let the user know that there are no items yet and to add them through the manager application.

<img src="readmePhotos/supervisor.gif">

### Technologies

JavaScript, mySQL, mySQL node module, and Inquirer node module.

#### Created by Kelsi Hoyle