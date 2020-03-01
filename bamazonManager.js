// application dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");

// sql database connection information
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootpassword",
    database: "bamazon_db"
});

function managerChoice() {
    // ask the manager what they want to do
    inquirer.prompt([{
            name: "choice",
            type: "list",
            message: "Please choose an action from the following: ",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add new Product",
                "Exit"
            ]
        }])
        .then(function (answer) {
            switch (answer.choice) {
                case "View Products for Sale":
                    productView();
                    break;
                case "View Low Inventory":
                    inventoryView();
                    break;
                case "Add to Inventory":
                    inventoryAdd();
                    break;
                case "Add new Product":
                    productAdd();
                    break;
                case "Exit":
                    process.exit();
            }

        })
}
// call the function
managerChoice();

function productView() {
    // displaying the available products 
    connection.connect(function (err) {
        if (err) throw err;
        // console.log the success
        console.log("connected as id " + connection.thread);
        // if connection is successful, display data
        connection.query(
            "SELECT item_id, product_name, price, stock_quantity FROM products",
            function (err, res) {
                if (err) throw err;
                // display the table of available items
                console.table(res);
                connection.end();
            }
        )
    })
}