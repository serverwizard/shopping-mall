const {Router} = require('express');
const router = Router();
const ctrl = require('./admin.ctrl');
const csrfProtection = require('../../middleware/csrf');

const upload = require('../../middleware/multer');

const paginate = require('express-paginate');

const adminRequired = require('../../middleware/adminRequired');

router.get('/products', paginate.middleware(3, 50), ctrl.get_products);

// 아래 각각 걸지 이렇게 한줄에 걸지는 자기 선택
router.use(adminRequired);

router.get('/products/write', csrfProtection, ctrl.get_write);
router.post('/products/write', upload.single('thumbnail'), csrfProtection, ctrl.post_write);
router.get('/products/detail/:id', ctrl.get_product_detail);
router.post('/products/detail/:id', ctrl.post_product_detail);
router.get('/products/edit/:id', csrfProtection, ctrl.get_edit);
router.post('/products/edit/:id', upload.single('thumbnail'), csrfProtection, ctrl.post_edit);
router.get('/products/delete/:id', ctrl.delete_product);
router.get('/products/delete/:product_id/:memo_id', ctrl.delete_memo_of_product);
router.post('/products/ajax_summernote', upload.single('thumbnail'), ctrl.post_summernote);

router.get('/order', ctrl.get_order);
router.get('/order/edit/:id', ctrl.get_order_edit);

module.exports = router;
