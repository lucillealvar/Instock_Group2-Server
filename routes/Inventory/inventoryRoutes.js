const express = require("express");
const router = express.Router();

const knex = require("knex")(require("../../knexfile"));

router.get("/", (req, res) => {
  res.send("@ inventory default route");
});

router.get("/allitems", (req, res) => {
  knex
    .select("*")
    // .select("item_name")
    .from("inventories")
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).send("na-da");
    });
});
module.exports = router;
