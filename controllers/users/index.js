const express = require('express');
const router = express.Router();

const ctrl = require('./users.ctrl');

router.get('/', ctrl.get_users);
router.get('/:id', ctrl.get_user);

module.exports = router;
