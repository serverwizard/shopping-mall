const {Router} = require('express');
const router = Router();
const ctrl = require('./products.ctrl');

router.get('/detail/:id', ctrl.get_product_detail);
router.post('/detail/:id', ctrl.post_product_detail);
router.get('/edit/:id', loginRequired, csrfProtection, ctrl.get_edit);
router.post('/edit/:id', loginRequired, upload.single('thumbnail'), csrfProtection, ctrl.post_edit);
router.get('/delete/:id', ctrl.delete_product);
router.get('/delete/:product_id/:memo_id', ctrl.delete_memo_of_product);
router.post('/ajax_summernote', loginRequired, upload.single('thumbnail'), ctrl.post_summernote);

module.exports = router;
