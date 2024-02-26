const { body, validationResult } = require("express-validator");

//Validate for warehouse input fields
const validateWarehouseInput = [
  body("warehouse_name").notEmpty().withMessage("Warehouse name is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("contact_name").notEmpty().withMessage("Contact name is required"),
  body("contact_position")
    .notEmpty()
    .withMessage("Contact position is required"),
  //Validate phone number
  body("contact_phone")
    .notEmpty()
    .withMessage("Contact phone is required")
    .isMobilePhone(undefined, { strictMode: false }) //method to check if input is valid phone #
    .withMessage("Invalid phone number"),
  //Validate email address
  body("contact_email")
    .notEmpty()
    .withMessage("Contact Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
];

//Check validation results
const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  //If validation errors occurs, returns 400 response with error details
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //If no error, proceeds to next route
  next();
};

module.exports = { validateWarehouseInput, validateMiddleware };