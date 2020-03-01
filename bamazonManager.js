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
                managerChoice();
            }
        )
    })
}

function inventoryView() {
    connection.connect(function (err) {
        if (err) throw err;
        // console.log the success
        console.log("connected as id " + connection.thread);
        // if connection is successful, proceed with data query
        connection.query(
            "SELECT product_name, stock_quantity FROM products WHERE stock_quantity < 5",
            function (err, res) {
                if (err) throw err;
                // display the table of low stock items
                console.table(res);
                console.log("===============================")


                managerChoice();
            }
        )
    })
}

function inventoryAdd() {
    inquirer.prompt([{
                name: "id",
                type: "input",
                message: "Which item id would you like to add to?",
                validate: function (value) {
                    var reg = /^\d+$/;
                    return reg.test(value) || "Please provide a number";
                }

            },
            {
                name: "quantity",
                type: "input",
                message: "How much stock would you like to add?",
                validate: function (value) {
                    var reg = /^\d+$/;
                    return reg.test(value) || "Please provide a number";
                }
            }
        ])
        .then(function (answer) {
            // use the user response to query database
            var search = "SELECT stock_quantity FROM products WHERE ?";

            connection.query(search, {
                item_id: answer.id
            }, function (err, res) {
                var stock = res[0].stock_quantity;
                if (err) throw err;
                // make sure a value exists for stock_quantity
                if (stock !== "undefined" && stock !== null) {

                    var userQuantity = parseInt(answer.quantity);
                    var newStock = userQuantity + stock;
                    // run the update function with updated value
                    stockUpdate(newStock, answer.id);
                }
                // console.log(res[0].stock_quantity)

                managerChoice();
            })
        })
}

function stockUpdate(newStock, id) {
    // adds the updated value to the database
    var update = "UPDATE products set ? WHERE ?";
    connection.query(update,
        [{
            stock_quantity: newStock
        }, {
            item_id: id
        }],
        function (err, res) {
            if (err) throw err;
            console.log("Your stock has been updated");
            managerChoice();
        })
}

function productAdd() {
    // ask the user for product details
    inquirer.prompt([{
            name: "name",
            type: "input",
            message: "What is the product name you would like to add?",
        }, {
            name: "dept",
            type: "input",
            message: "What department is the product in?"
        }, {
            name: "price",
            type: "input",
            message: "What is the product price?",
            validate: function (value) {
                var regexp = /^\d+\.\d{0,2}$/;
                return regexp.test(value) || "Please provide a dollar value";
            }

        }, {
            name: "qty",
            type: "input",
            message: "What is the product quantity?",
            validate: function (value) {
                var reg = /^\d+$/;
                return reg.test(value) || "Please provide a number";
            }
        }])
        .then(function (answer) {
            var add = "INSERT INTO products SET ?";
            // change values from string
            var price = parseFloat(answer.price);
            var qty = parseInt(answer.qty);


            connection.query(add, {
                product_name: answer.name,
                department_name: answer.dept,
                price: price,
                stock_quantity: qty
            }, function (err, res) {
                if (err) throw err;
                console.log("New product added")
                console.log("===============================")
                managerChoice();
            })
        });
}