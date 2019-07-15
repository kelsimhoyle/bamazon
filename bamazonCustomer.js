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
    inquirer.prompt([
        {
            message: "How would you like to shop today?",
            type: "list",
            name: "action",
            choices: [
                "View All Items",
                "View By Department",
                "Exit"
            ]
        }
    ]).then(function (answer) {
        switch (answer.action) {
            case "View All Items":
                return chooseItem();
            case "View By Department":
                return viewByDepartment();
            default:
                return connection.end();
        }
    })
}

function displayProducts(data) {
    inquirer.prompt([
        {
            message: "What item would you like to purchase?",
            type: "list",
            name: "item",
            choices: function () {
                var choice = data.map(function (product) {
                    var item = `${product.product_name} | $${product.price}`;
                    var id = product.item_id;
                    // the value that is returned is the primary key,
                    // what the user sees is the name of the product and price
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
        var quantity = answers.quantity;

        buyItem(itemId, quantity);
    })
}


function buyItem(itemId, quantity) {
    connection.query("SELECT * FROM products WHERE ?", {
        item_id: itemId
    }, function (err, data) {
        if (err) throw err;
        var currentStock = data[0].stock_quantity;
        var itemPrice = data[0].price;
        var charged = (parseFloat(itemPrice) * parseFloat(quantity)).toFixed(2);
        var department = data[0].department_name;

        if (currentStock >= quantity) {
            var stockUpdate = currentStock - quantity;
            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: parseInt(stockUpdate),
                product_sales: charged
            }, {
                item_id: itemId
            }], function (err) {
                if (err) throw err;

                console.log(`\nYou have been charged $${charged}. Thank you for your purchase!\n`)
                menu();
            })
        } else {
            console.log("\nNot enough items in stock. Please make another selection. \n");
            menu();
        }
    })
}

function viewByDepartment() {
    connection.query("SELECT * FROM departments", function (err, data) {
        if (err) throw err;

        inquirer.prompt(
            {
                message: "What department would you like to view?",
                type: "list",
                name: "department",
                choices: function () {
                    var choice = data.map(function (department) {
                        var departmentName = department.department_name;

                        return departmentName;
                    });

                    return choice;
                }

            }
        ).then(function (answer) {
            var departmentName = answer.department

            connection.query("SELECT * FROM products WHERE ?", {
                department_name: departmentName
            }, function (err, data) {
                if (err) throw err;

                displayProducts(data);
            })

        })
    })  
}

function chooseItem() {
    connection.query("SELECT * FROM products", function (err, data) {
        if (err) throw err;

        displayProducts(data);
    })
}

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    menu();
});