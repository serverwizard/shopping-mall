const express = require('express');
const router = express.Router();
const ctrl = require('./checkout.ctrl');

router.get('/', ctrl.index);
router.get('/complete', ctrl.get_complete);
router.post('/complete', ctrl.post_complete);
router.get('/success', ctrl.get_success);

router.get('/nomember', ctrl.get_nomember);
router.get('/nomember/search', ctrl.get_nomember_search);

// 송장번호
router.get('/shipping/:invc_no', ctrl.get_shipping);

module.exports = router;