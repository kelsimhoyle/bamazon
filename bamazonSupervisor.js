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
            "View Product Sales by Department",
            "Create New Department",
            "Exit"
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case "View Product Sales by Department":
                return viewDepartment();
            case "Create New Department":
                return createDepartment();
            default:
                return connection.end();
        }
    })
}

function viewDepartment() {
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

            var query = "SELECT products.product_sales, products.department_name, departments.over_head_costs, ";
            query += "(products.product_sales - departments.over_head_costs) AS total_profit ";
            query += "FROM products JOIN departments ON departments.department_name = products.department_name ";
            query += "WHERE products.department_name = ";
            query += `"${departmentName}"`;

            
            connection.query(query, function(err, data) {
                if (err) throw err;

                console.table(data);
                menu();
            })
        })
    })
}

function createDepartment() {
    inquirer.prompt([
        {
            message: "What is the name of the department that you want to add?",
            name: "name"
        },
        {
            message: "What is the total over head cost?",
            name: "overHead",
            validate: function (input) {
                if (isNaN(input)) {
                    return "Price must be a number.";
                }

                return true;
            }
        },

    ]).then(function (answers) {
        connection.query("INSERT INTO departments SET ?", {
            department_name: answers.name,
            over_head_costs: parseFloat(answers.overHead),
        }, function (err) {
            if (err) throw err;

            console.log(`Added new department: ${answers.name}.\n`);
            menu();
        })
    });
}

connection.connect(function (err) {
    if (err) throw err;

    menu();
});