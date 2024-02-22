const express = require('express');
const router = express.Router();

router.get('/inventory', (req, res) => {
    res.send('List of items');
})

module.exports = router;