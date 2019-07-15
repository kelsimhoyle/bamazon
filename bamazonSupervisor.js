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

            var query = "SELECT p.department_name, d.`over_head_costs`, SUM(p.product_sales) AS product_sales, ";
            query += "(SUM(p.product_sales) - d.over_head_costs) as total_profits ";
            query += "FROM products AS p JOIN departments d ON d.department_name = p.department_name ";
            query += `WHERE p.department_name = "${departmentName}"`;
            query += "GROUP BY p.department_name, d.over_head_costs; "

            connection.query(query, function (err, data) {
                if (err) throw err;

                if (data.length === 0) {
                    console.log("\nNo products to display, yet!\n Add products in the manager application.\n")
                } else {
                    console.table(data);
                }
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