var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    chooseItem();
});

function chooseItem() {
    connection.query("SELECT * FROM products", function (err, data) {
        if (err) throw err;

        inquirer.prompt([
            {
                message: "What item would you like to purchase?",
                type: "list",
                name: "item",
                choices: function () {
                    var choice = data.map(function (product) {
                        var item = `${product.product_name} $${product.price}`;
                        var id = product.item_id;
                        return {
                            value: id,
                            name: item
                        };
                    });

                    return choice;
                }

            },
            {
                message: "How many would you like to purchase?",
                name: "quantity",
                validate: function (input) {
                    if (isNaN(input)) {
                        return "Please enter a valid number.";
                    }

                    return true;
                }
            }
        ]).then(function (answers) {
            var itemId = answers.item;
            connection.query("SELECT * FROM products WHERE ?", {
                item_id: itemId
            }, function (err, data) {
                if (err) throw err;
                var currentStock = data[0].stock_quantity;
                var itemPrice = data[0].price;
                var charged = parseFloat(itemPrice) * parseFloat(answers.quantity);

                if (currentStock >= answers.quantity) {
                    var stockUpdate = currentStock - answers.quantity;
                    connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: parseInt(stockUpdate)
                    }, {
                        item_id: itemId
                    }], function (err) {
                        if (err) throw err;

                        console.log(`You have been charged $${charged}. Thank you for your purchase!`);
                        connection.end();
                    })
                } else {
                    console.log("Not enough items in stock. Please make another selection. \n");
                    chooseItem();
                }
            })
        })
    })
}
