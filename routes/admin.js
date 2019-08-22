const express = require('express');
const models = require('../models');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('admin url 입니다.');
});

// router.get('/products', (req, res) => {
//     // res.send('admin products url 입니다.');
//     res.render('admin/products.html', {productName: "맥북"});
// });

router.get('/products', (req, res) => {
    // res.send('admin products url 입니다.');
    models.Products.findAll().then((products) => {
        res.render('admin/products.html', {products: products});
    });
});

router.get('/products/write', (req, res) => {
    res.render('admin/form.html');
});

router.post('/products/write', (req, res) => {
    // models.Products.create({
    //     name: req.body.name,
    //     price: req.body.price,
    //     description: req.body.description
    // }).then(() => {
    //     res.redirect('/admin/products');
    // });

    models.Products.create(req.body).then(() => {
        res.redirect('/admin/products');
    });
});

module.exports = router;