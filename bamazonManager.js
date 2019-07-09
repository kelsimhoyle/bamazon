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
    }).then(function(answer){
        switch(answer.action) {
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
    connection.query("SELECT * FROM products", function(err, data) {
        if (err) throw err;

        console.table(data);
        doNext();
    })
}

function viewLow() {

}

function addInventory() {

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
    }).then(function(answer){
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

