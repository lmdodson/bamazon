# bamazon

This project is a command line node app that uses a MySQL database to present an Amazon-type store.

It has:
* A customer application that allows the user to view current stock and make purchase choices.
![customer view](https://github.com/lmdodson/bamazon/blob/master/assets/customerView.png)

* A manager application that allows the user to perform several requests on the data.
![manager choices](https://github.com/lmdodson/bamazon/blob/master/assets/managerViewChoices.png)

The manager can:
1. View Products for Sale - This option allows the manager to view the entire database of items in the store
2. View Low Inventory - This option will show the manager all items with a stock of five items or less.
![low inventory view](https://github.com/lmdodson/bamazon/blob/master/assets/managerViewLowInventory.png)
3. Add to Inventory - This option allows the manager to add more stock to a specific item Using the id number from the items table.
4. Add new product - This option allows the manager to add a totally new item to the database. The manager must provide the appropriate item details.



### Built With

Javascript
NodeJS
MySQL
Inquirer

## Authors

-   **Leah Dodson**
