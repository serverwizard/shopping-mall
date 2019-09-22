const express = require('express');
const router = express.Router();
const ctrl = require('./cart.ctrl');

const userCart = require('../../middleware/userCart');

router.get("/", ctrl.index);
router.post("/", userCart, ctrl.post_cart);

module.exports = router;