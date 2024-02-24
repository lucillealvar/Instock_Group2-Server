const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile"));

router.get("/", (req, res) => {
  // GET all warehouses (except timestamps)
  knex("warehouses")
    .select(
      "id",
      "warehouse_name",
      "address",
      "city",
      "country",
      "contact_name",
      "contact_position",
      "contact_phone",
      "contact_email"
    )
    .then((warehouses) => {
      res.status(200).json(warehouses);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "Something went wrong. Please try again later" });
    });
});

// GET inventories by warehouse ID
router.get("/:id/inventories", (req, res) => {
  knex("warehouses")
    .select("id")
    .then((warehouse) => {
      if (warehouse.length === 0) {
        res.status(404).json({ error: "Warehouse not found" });
      } else {
        knex("inventories")
          .select(
            "id",
            "item_name",
            "category",
            "status",
            "quantity"
          )
          .then((inventories) => {
            res.status(200).json(inventories);
          })
          .catch((error) => {
            console.error(error);
            res
              .status(500)
              .json({ error: "Something went wrong. Please try again later" });
          });
      }
    });
});

module.exports = router;
