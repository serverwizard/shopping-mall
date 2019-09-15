const {Router} = require('express');
const router = Router();
const ctrl = require('./products.ctrl');

router.get('/products/detail/:id', ctrl.get_product_detail);
router.post('/products/detail/:id', ctrl.post_product_detail);
router.get('/products/edit/:id', loginRequired, csrfProtection, ctrl.get_edit);
router.post('/products/edit/:id', loginRequired, upload.single('thumbnail'), csrfProtection, ctrl.post_edit);
router.get('/products/delete/:id', ctrl.delete_product);
router.get('/products/delete/:product_id/:memo_id', ctrl.delete_memo_of_product);
router.post('/products/ajax_summernote', loginRequired, upload.single('thumbnail'), ctrl.post_summernote);

module.exports = router;
