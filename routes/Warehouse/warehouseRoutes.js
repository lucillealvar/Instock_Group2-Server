const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile"));

// GET all warehouses (except timestamps)
router.get("/", (req, res) => {
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

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;

  if (
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const phoneRegex = /^\+\d{1,3}\s\(\d{3}\)\s\d{3}-\d{4}$/;
  const emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  if (!phoneRegex.test(contact_phone)) {
    return res.status(400).json({ message: "Invalid phone number" });
  }
  if (!emailRegex.test(contact_email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    const existingWarehouse = await knex("warehouses").where({ id }).first();
    if (!existingWarehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }
    await knex("warehouses").where({ id }).update({
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    });
    const updatedWarehouse = await knex("warehouses").where({ id }).first();
    res.status(200).json(updatedWarehouse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET inventories by warehouse ID
router.get("/:id/inventories", (req, res) => {
  const warehouseId = req.params.id;
  knex("warehouses")
    .select("id")
    .where("id", warehouseId)
    .then((warehouse) => {
      if (warehouse.length === 0) {
        res.status(404).json({ error: "Warehouse not found" });
      } else {
        knex("inventories")
          .select("id", "item_name", "category", "status", "quantity")
          .where("warehouse_id", warehouseId)
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

router.delete("/:deleteID", (req, res) => {
  // this deletes selected warehouse by warehouse ID
  // (also delets associated inventories that references that
  // warehouse's ID ==> already implement from schema)
  let deleteID = req.params.deleteID;

  knex("warehouses")
    .where("id", deleteID)
    .select("id")
    .then((rows) => {
      console.log(rows.length);
      if (rows.length === 0) {
        res.status(404).send(`Warehouse ${deleteID} not found`);
      } else {
        knex
          .from("warehouses")
          .where("warehouses.id", deleteID)
          // .returning()
          .del()
          .then((data) => {
            res.status(204).send("deleted");
            // FIXME: idk why the message is not going through,
            // besides that it, all works...
          })
          .catch((e) => {
            res.status(404).send(e);
          });
      }
    });
});

module.exports = router;
