const { Router } = require('express');
const router = Router();
const ctrl = require('./admin.ctrl');
const paginate = require('express-paginate');
const csrfProtection = require('../../middleware/csrf');

const loginRequired = require('../../middleware/loginRequired');
const upload = require('../../middleware/multer');

router.get('/products', paginate.middleware(3, 50), ctrl.get_products );
router.get('/products/write', loginRequired, csrfProtection , ctrl.get_write );
router.post('/products/write' , loginRequired , upload.single('thumbnail'),  csrfProtection, ctrl.post_write);

module.exports = router;
