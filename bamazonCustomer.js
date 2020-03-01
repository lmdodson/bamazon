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
    // if connection is successful, execute the database query
    connection.query(
        "SELECT item_id, product_name, price FROM products",
        function (err, res) {
            if (err) throw err;
            // display the table of available items
            console.table(res);
            // run the purchase function for user
            purchase();
        }
    );
});

function purchase() {
    // asking the user what they want to purchase
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
            // use the user response to query the database
            var search = "SELECT price, stock_quantity FROM products WHERE ?";

            connection.query(search, {
                item_id: answer.id
            }, function (err, res) {
                if (err) throw err;
                var userQuantity = parseInt(answer.quantity)
                // console.log(res[0].stock_quantity, res[0].price)
                // check the stock quantity against the user selection
                if (res[0].stock_quantity >= userQuantity) {
                    var newStock = res[0].stock_quantity - userQuantity
                    // console.log(newStock)
                    stockUpdate(newStock, answer.id);
                    // give the user their total
                    console.log("Your total price is: " + res[0].price * answer.quantity)

                } else {
                    // if there's not enough in stock to fulfill the sale:
                    console.
                    log("Sorry there is not that much in stock! Please make another selection");
                    // rerun the purchase query
                    purchase();
                }
                connection.end()
            })
        });
}

function stockUpdate(newStock, id) {
    var update = "UPDATE products set ? where ?";
    connection.query(update,
        [{
            stock_quantity: newStock
        }, {
            item_id: id
        }],
        function (err, res) {
            if (err) throw err;
        });
}