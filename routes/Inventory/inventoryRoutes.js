const express = require("express");
const router = express.Router();

const knex = require("knex")(require("../../knexfile"));

router.get("/", (req, res) => {
  res.send("@ inventory default route");
});

router.get("/allitems", (req, res) => {
  knex("inventories")
    // .select("*")
    .select(
      "inventories.id",
      "warehouse.warehouse_name",
      "inventories.item_name",
      "inventories.description",
      "inventories.category",
      "inventories.status",
      "inventories.quantity"
    )
    .innerJoin("warehouse", "warehouse_name", "=", "inventories.warehouse_name")
    .from("inventories")
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).send("na-da");
    });
});

router.get("/test1", (req, res) => {
  knex
    .select(
      "inventories.id",
      //   "warehouse.warehouse_name",
      "inventories.item_name",
      "inventories.description",
      "inventories.category",
      "inventories.status",
      "inventories.quantity"
    )
    .from("inventories")
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).send("na-da");
    });
});
module.exports = router;
