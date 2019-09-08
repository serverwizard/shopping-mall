const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.render('chat/index.html');
});

module.exports = router;