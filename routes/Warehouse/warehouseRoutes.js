const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile"));

router.get("/", (req, res) => {
  // fetch all warehouses from the database
  knex("warehouses")
    .select("*")
    .then((warehouses) => {
      res.status(200).json(warehouses);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Something went wrong. Please try again later" });
    });
});

module.exports = router;
