const express = require('express');
const router = express.Router();
const models = require('../../models');

router.get('/:id' , async(req, res) => {
    try{
        const product = await models.Products.findByPk(req.params.id);
        res.render('products/detail.html', { product });

    }catch(e){
        console.error(e);
    }
});


module.exports = router;