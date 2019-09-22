const express = require('express');
const router = express.Router();
const ctrl = require('./checkout.ctrl');

router.get('/', ctrl.index);
router.get('/complete', ctrl.get_complete);
router.post('/complete', ctrl.post_complete);
router.get('/success', ctrl.get_success);

module.exports = router;