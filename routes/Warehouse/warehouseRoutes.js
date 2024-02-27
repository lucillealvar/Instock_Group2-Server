const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile"));
const {
  validateWarehouseInput,
  validateMiddleware,
} = require("../../middleware/validationMiddleware");

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

//PUT or EDIT a warehouse
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
  //retrieve warehouse ID from request parameters
  const warehouseId = req.params.id;
  //check if warehouse exist
  knex("warehouses")
    .select("id")
    .where("id", warehouseId)
    .then((warehouse) => {
      //handling if warehouse exist or not
      if (warehouse.length === 0) {
        res.status(404).json({ error: "Warehouse not found" });
      } else {
        //fetching inventories for the warehouse
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

//POST or create a new warehouse
router.post("/", validateWarehouseInput, validateMiddleware, (req, res) => {
  //retrive data
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
  //add new warehouse data
  knex("warehouses")
    .insert({
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    })
    .then(() => {
      //returns the new added data
      return knex("warehouses")
        .where({ warehouse_name })
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
        );
    })
    .then((insertedData) => {
      const createdWarehouse = insertedData[0];
      res.status(201).json(createdWarehouse);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "Something went wrong. Please try again later. " });
    });
});

//DELETE a warehouse
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
            //  ANSWER: b/c 204 does not send anything back...
          })
          .catch((e) => {
            res.status(404).send(e);
          });
      }
    });

  /* 
      MAGIC: what the merits of each implementation of delete
      (ex. the delete method in inventeries vs warehouses)
      ANSWER:
      Keypoints: defensive programming and intended functionality and 
      potentially difference in resource used... (what resource? time?
        #of calls => latency)

        -defensive programming: in the eyes of a "tester/hacker" they 
        will pick up on/ could be inferred on the type of validation used 
        and the interworking of a given route or even the structure of the
        database... Also, in a broader sense, 
        the client doesnt really need to know that something is already 
        delete, they just need to know that what they want to be delete 
        is not there anymore. In otherwords, we can just implement a 
        "slient error", meaning after the item is deleted the first time
        , if they try to delete it (the same one) again we would just 
        send them the same response even if the queried item is not present
        anymore...

        intended function: using the delete 1example in warehouses, 
        if the intended purpose was to relay an error, this method would 
        be the better method... as it is not going through the del() at 
        all... instead it is stopping short...
        
        but... if something is just for deleting, let it just handling 
        delete, so from industry perspective, the delete method in iventory
        is safer... (if you replace that if statment with just
         "res.status(204).send("item deleted")"
    */
});

module.exports = router;
