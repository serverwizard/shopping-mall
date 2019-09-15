const { Router } = require('express');
const router = Router();

router.use('/', require('./home'));
router.use('/admin', require('./admin'));
router.use('/accounts', require('./accounts'));
router.use('/auth', require('./auth'));
router.use('/chat', require('./chat'));

module.exports = router;