const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const inventoryRoute = ('./Server/routes/Inventory/inventoryRoutes.js');
const warehouseRoute = ('./Server/routes/Warehouse/warehouseRoutes.js');

dotenv.config(); // Load environment variables
const app = express();
const port = process.env.PORT || 3000;

//middleware CORS
app.use(cors());

//middleware to parse JSON requests
app.use(express.json());

//routes
app.use('/inventory', inventoryRoute);
app.use('/warehouse', warehouseRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${PORT}`);
})