const express = require("express");
const router = express.Router();

const knex = require("knex")(require("../../knexfile"));

router.get("/", (req, res) => {
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

router.get("/:intventoyid", (req, res) => {
  // return specific objects based on inventories.id
  let selectid = req.params.intventoyid;
  console.log(selectid);

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
    .where("inventories.id", selectid)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(404).send("ID is not found");
    });
});


router.put("/:id", async (req, res) => {
  try {
    const inventoryId = req.params.id;
    const {
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity
    } = req.body;

    // Check if all required properties exist
    if (
      !warehouse_id ||
      !item_name ||
      !description ||
      !category ||
      !status ||
      !quantity ||
    ) {
      return res.status(400).json({ error: "Missing properties in the request body" });
    }

    // Check if warehouse_id exists in warehouses table
    const warehouseExists = await knex("warehouses").where("id", warehouse_id).first();
    if (!warehouseExists) {
      return res.status(400).json({ error: "Warehouse ID does not exist" });
    }
  }
});

module.exports = router;
