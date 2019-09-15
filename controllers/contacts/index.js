const { Router } = require('express');
const router = Router();
const ctrl = require('./contacts.ctrl');

const csrf = require('csurf');
const csrfProtection = csrf({cookie: true});

const upload = require('../../middleware/multer');

router.get('/', ctrl.get_contacts);
router.get('/write', csrfProtection, ctrl.get_write);
router.post('/write', upload.single('certificate'), csrfProtection, ctrl.post_write);
router.get('/detail/:id', ctrl.get_detail);
router.post('/detail/:id', ctrl.post_detail);
router.get('/delete/:id', ctrl.delete_contacts);
router.get('/delete/:contact_id/:memo_id', ctrl.delete_memo_of_contacts);
router.get('/edit/:id', csrfProtection, ctrl.get_edit);
router.post('/edit/:id', upload.single('certificate'), csrfProtection, ctrl.post_edit);

module.exports = router;