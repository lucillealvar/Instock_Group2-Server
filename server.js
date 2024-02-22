const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");

// route imports
const inventoryRoute = require("./Server/routes/Inventory/inventoryRoutes");
const warehouseRoute = require("./Server/routes/Warehouse/warehouseRoutes");

// load environment variables
const PORT = process.env.PORT || 3000;

//middleware CORS
app.use(cors());

//middleware to parse JSON requests
app.use(express.json());

//routes
app.use("/inventory", inventoryRoute);
app.use("/warehouse", warehouseRoute);

// app.get("/", (req, res) => {
//   res.send("this is the root route");
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
