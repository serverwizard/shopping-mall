const express = require('express');
const router = express.Router();

router.get('/', (req, res)=> {
    res.send('admin url 입니다.');
});

router.get('/products', (req, res)=> {
    res.send('admin products url 입니다.');
});

module.exports = router;