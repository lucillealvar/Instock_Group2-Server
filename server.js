const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");

const knex = require("knex")(require("./knexfile"));
// const knex = require("knex")(require("<path is relative to import file>"));

// route imports
const inventoryRoute = require("./routes/Inventory/inventoryRoutes");
const warehouseRoute = require("./routes/Warehouse/warehouseRoutes");

// load environment variables
const PORT = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api/inventories", inventoryRoute);
app.use("/api/warehouses", warehouseRoute);

//-------------------------------
//test connetion routes
app.get("/test1", (req, res) => {
  res.send("THIS IS THE SERVER!!!");
});

app.get("/test2/:status", (req, res) => {
  let checkstatus;
  let stockstatus = req.params.status;

  if (stockstatus === "instock") {
    checkstatus = "In Stock";
  } else if (stockstatus === "outofstock") {
    checkstatus = "Out of Stock";
  }
  knex
    .select("id", "warehouse_id", "item_name")
    .from("inventories")
    .where("status", checkstatus)
    .then((data) => res.json(data))
    .catch((error) => res.status(500).send("na-da!!!"));
});

//  dynamically Lookup a specific (distinct) values in a given column
//  for a given table
app.get("/api/:table/list/specific/:keyword", (req, res) => {
  let tablekeyword = req.params.table;
  let keyword = req.params.keyword;

  // res.send("sdfsf");
  knex
    .select(keyword)
    .from(tablekeyword)
    .distinct()
    .then((data) => {
      // console.log(data);
      let array = data;
      let finalpackage = [];

      array.forEach((element) => {
        let name = element[keyword];
        finalpackage.push(name);
      });

      // console.log(finalpackage);

      res.json(finalpackage);
    });
});

//-------------------------------

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
