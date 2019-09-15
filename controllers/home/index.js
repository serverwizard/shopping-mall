const { Router } = require('express');
const router = Router();
const ctrl = require('./home.ctrl');

router.get('/', ctrl.index);

module.exports = router;