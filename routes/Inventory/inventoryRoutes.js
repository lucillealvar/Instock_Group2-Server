const express = require("express");
const router = express.Router();
const {
  validateItemInput,
  validateMiddleware,
} = require("../../middleware/validationMiddleware");

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

router.post("/", validateItemInput, validateMiddleware, async (req, res) => {
  try {
    const { warehouse_id, item_name, description, category, status, quantity } =
      req.body;


    // Check if warehouse_id exists in warehouses table
    const warehouseExists = await knex("warehouses")
      .where("id", warehouse_id)
      .first();
    if (!warehouseExists) {
      return res.status(400).json({ error: "Warehouse ID does not exist" });
    }

    // Insert new inventory item
    const [newInventoryId] = await knex("inventories").insert({
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    });

    // Fetch the newly created inventory item
    const newInventory = await knex("inventories")
      .where("id", newInventoryId)
      .first();

    // Return the newly created inventory item
    res.status(201).json(newInventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:inventoryid", (req, res) => {
  // return specific objects bassed on inventories.id
  let selectid = Number(req.params.inventoryid);
  console.log(selectid);
  // res.send(typeof selectid);
  if (Number.isInteger(selectid)) {
    console.log("is a number");
    knex
      .select(
        "inventories.id",
        "inventories.warehouse_id",
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
  } else {
    console.log("not a number");
    res.status(404).send("ID is not found");
  }
});

router.put("/:id", validateItemInput, validateMiddleware, async (req, res) => {
  try {
    const inventoryId = req.params.id;
    const { warehouse_id, item_name, description, category, status, quantity } =
      req.body;

    // Check if warehouse_id exists in warehouses table
    const warehouseExists = await knex("warehouses")
      .where("id", warehouse_id)
      .first();
    if (!warehouseExists) {
      return res.status(400).json({ error: "Warehouse ID does not exist" });
    }

    // Check if quantity is a number
    if (isNaN(quantity)) {
      return res.status(400).json({ error: "Quantity must be a number" });
    }

    // Update the inventory item
    await knex("inventories").where("id", inventoryId).update({
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    });

    // Fetch the updated inventory item
    const updatedItem = await knex("inventories")
      .where("id", inventoryId)
      .first();

    // Return the updated inventory item
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Delete an inventory item
router.delete("/:id", (req, res) => {
  const inventoryId = req.params.id;
  knex("inventories")
    .where("id", inventoryId)
    .del()
    .then((deleted) => {
      if (deleted === 0) {
        res.status(404).json({ error: "Inventory item not found " });
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "Something went wrong. Please try again later" });
    });
});

// Lookup a specific (distinct) values in a given column
router.get("/list/name", (req, res) => {
  knex
    .select("category")
    .from("inventories")
    .distinct()
    .then((data) => {
      console.log(data);
      let array = data;
      let finalpackage = [];

      array.forEach((element) => {
        let name = element.category;
        finalpackage.push(name);
      });

      console.log(finalpackage);

      res.json(finalpackage);
    });
});

module.exports = router;
