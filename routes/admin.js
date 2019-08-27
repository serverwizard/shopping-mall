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

// router.get('/products', (req, res) => {
//     // res.send('admin products url 입니다.');
//     models.Products.findAll().then((products) => {
//         res.render('admin/products.html', {products: products});
//     });
// });

router.get('/products', async (_, res) => {
    // res.send('admin products url 입니다.');
    try {
        const products = await models.Products.findAll();
        res.render('admin/products.html', {products: products});
    } catch (e) {
        console.error(e);
    }
});


router.get('/products/write', (req, res) => {
    res.render('admin/form.html');
});

// router.post('/products/write', (req, res) => {
//     // models.Products.create({
//     //     name: req.body.name,
//     //     price: req.body.price,
//     //     description: req.body.description
//     // }).then(() => {
//     //     res.redirect('/admin/products');
//     // });
//
//     models.Products.create(req.body).then(() => {
//         res.redirect('/admin/products');
//     });
// });

router.post('/products/write', async (req, res) => {
    // models.Products.create({
    //     name: req.body.name,
    //     price: req.body.price,
    //     description: req.body.description
    // }).then(() => {
    //     res.redirect('/admin/products');
    // });

    await models.Products.create(req.body);
    res.redirect('/admin/products');
});

router.get('/products/detail/:id', async (req, res) => {
    const product = await models.Products.findByPk(req.params.id);
    res.render('admin/detail.html', {product});
});

// TODO 페이징 처리는 어떻게?
router.get('/products/edit/:id', async (req, res) => {
    const product = await models.Products.findByPk(req.params.id);
    res.render('admin/form.html', {product});
});

router.post('/products/edit/:id', async (req, res) => {
    await models.Products.update({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description
        }, {
            where: {id: req.params.id}
        }
    );

    res.redirect('/admin/products/detail/' + req.params.id);

});

router.get('/products/delete/:id', async (req, res) => {
    await models.Products.destroy({
        where: {id: req.params.id}
    });
    res.redirect('/admin/products');
});

module.exports = router;