const express = require("express");
const router = express.Router();

const knex = require("knex")(require("../../knexfile"));

router.get("/", (req, res) => {
  res.send("@ inventory default route");
});

router.get("/simplyall", (req, res) => {
  // returns all Inventory objects, unfiltered
  knex("inventories")
    .select("*")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).send("na-da");
    });
});

router.get("/withwarehousenames", (req, res) => {
  // return all Inventory object, replace inventory.warehouse_id
  // with warehouses.warehouse_name
  knex
    .select(
      "inventories.id",
      "warehouses.warehouse_name",
      "inventories.item_name",
      "inventories.description",
      "inventories.category",
      "inventories.status",
      "inventories.quantity"
    )
    .from("inventories")
    .join("warehouses", "inventories.warehouse_id", "warehouses.id")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).send("na-da");
    });
});

module.exports = router;
