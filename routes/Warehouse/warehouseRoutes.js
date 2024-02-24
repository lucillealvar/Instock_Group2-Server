const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile"));

router.get("/", (req, res) => {
  res.send("List of warehouse");
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

module.exports = router;

