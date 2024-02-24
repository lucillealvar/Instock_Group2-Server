const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile"));

router.get("/", (req, res) => {
  // fetch all warehouses from the database
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

router.delete("/:deleteID", (req, res) => {
  let deleteID = req.params.deleteID;
  res.send(`we are deleting ${deleteID} warehouse`);
});

module.exports = router;
