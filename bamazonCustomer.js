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
// connection function
connection.connect(function (err) {
    if (err) throw err;
    // console.log the success
    console.log("connected as id " + connection.threadId);
    // if connection is successful, execute the app function
    // start();

    connection.query(
        "SELECT item_id, product_name, price FROM products",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            console.log("------------------------");
            purchase();
        }
    );
});

function purchase() {
    inquirer
        .prompt([{
                name: "id",
                type: "input",
                message: "Please provide the item id number of the item you would like to purchase.",
                validate: function (value) {
                    var reg = /^\d+$/;
                    return reg.test(value) || "Please provide a number";
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many of this item would you like to purchase?",
                validate: function (value) {
                    var reg = /^\d+$/;
                    return reg.test(value) || "Please provide a number";
                }
            }
        ])
        .then(function (answer) {
            var search = "SELECT stock_quantity FROM products WHERE ?";

            connection.query(search, {
                item_id: answer.id
            }, function (err, res) {
                if (err) throw err;
                console.log(res[0].stock_quantity)
                connection.end()
            })
        });
}