// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// task 3: INTENTIONAL ERROR
router.get("/type/: ErrorinventoryId", invController.buildErrorByInventoryId);

module.exports = router;
