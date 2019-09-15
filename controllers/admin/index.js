const { Router } = require('express');
const router = Router();
const ctrl = require('./admin.ctrl');
const csrfProtection = require('../../middleware/csrf');

const loginRequired = require('../../middleware/loginRequired');
const upload = require('../../middleware/multer');

const paginate = require('express-paginate');

router.get('/products', paginate.middleware(3, 50), ctrl.get_products );

router.get('/products/write', loginRequired, csrfProtection , ctrl.get_write );
router.post('/products/write' , loginRequired , upload.single('thumbnail'),  csrfProtection, ctrl.post_write);
router.get('/products/detail/:id', ctrl.get_product_detail);
router.post('/products/detail/:id', ctrl.post_product_detail);
router.get('/products/edit/:id', loginRequired, csrfProtection, ctrl.get_edit);
router.post('/products/edit/:id', loginRequired, upload.single('thumbnail'), csrfProtection, ctrl.post_edit);
router.get('/products/delete/:id', ctrl.delete_product);
router.get('/products/delete/:product_id/:memo_id', ctrl.delete_memo_of_product);
router.post('/products/ajax_summernote', loginRequired, upload.single('thumbnail'), ctrl.post_summernote);

module.exports = router;
