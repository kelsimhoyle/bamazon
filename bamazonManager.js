var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

function menu() {
    inquirer.prompt({
        message: "What would you like to do?",
        type: "list",
        name: "action",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Exit"
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case "View Products for Sale":
                return viewProducts();
            case "View Low Inventory":
                return viewLow();
            case "Add to Inventory":
                return addInventory();
            case "Add New Product":
                return addProduct();
            default:
                connection.end();
        }
    })
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, data) {
        if (err) throw err;

        console.table(data);
        doNext()
    });
}

function viewLow() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 50", function (err, data) {
        if (err) throw err;
        console.log("Low Inventory:")
        console.table(data);
        doNext();
    })
}

function addInventory() {
    connection.query("SELECT * FROM products", function (err, data) {
        if (err) throw err;

        inquirer.prompt([
            {
                message: "What item would you like to update?",
                type: "list",
                name: "item",
                choices: function () {
                    var choice = data.map(function (product) {
                        var item = `${product.product_name} $${product.stock_quantity}`;
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
                message: "How much inventory would you like to add?",
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
                var updatedStock = parseInt(answers.quantity) + parseInt(data[0].stock_quantity);

                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: updatedStock
                }, {
                    item_id: itemId
                }], function (err) {
                    if (err) throw err;

                    console.log(`Added ${answers.quantity} items to ${data[0].product_name}. There are now ${updatedStock} items in stock.\n`);

                    doNext();
                })
            })

        })
    })

}



function addProduct() {

}

function doNext() {
    inquirer.prompt({
        message: "What would you like to next?",
        type: "list",
        name: "action",
        choices: [
            "Go Back to Main Menu",
            "Exit"
        ]
    }).then(function (answer) {
        if (answer.action === "Go Back to Main Menu") {
            menu();
        } else {
            connection.end();
        }
    })
}

connection.connect(function (err) {
    if (err) throw err;

    menu();
});