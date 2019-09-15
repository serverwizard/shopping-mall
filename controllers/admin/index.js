const { Router } = require('express');
const router = Router();
const ctrl = require('./admin.ctrl');
const paginate = require('express-paginate');

router.get('/products', paginate.middleware(3, 50), ctrl.get_products );

module.exports = router;