exports.get_product_detail = async (req, res) => {
    const product = await models.Products.findOne({
        where: {
            id: req.params.id
        },
        include: [
            'Memo'
        ]
    });

    res.render('admin/detail.html', {product});
};

exports.post_product_detail = async (req, res) => {
    try {

        const product = await models.Products.findByPk(req.params.id);
        // create + as에 적은 내용 ( Products.js association 에서 적은 내용 )
        await product.createMemo(req.body);
        res.redirect('/admin/products/detail/' + req.params.id);

    } catch (e) {
        console.log(e)
    }
};

exports.get_edit = async (req, res) => {
    const product = await models.Products.findByPk(req.params.id);
    res.render('admin/form.html', {product, csrfToken: req.csrfToken()});
};

exports.post_edit = async (req, res) => {
    try {
        // DB에 저장돼있는 파일 read
        const product = await models.Products.findByPk(req.params.id);

        if (req.file && product.thumbnail) {  // 기존 파일이 존재 하면 기존 이미지 삭제
            fs.unlinkSync(uploadDir + '/' + product.thumbnail);
        }

        // 파일이 수정됐으면 수정된 파일명 사용, 아니면 기존 것 사용
        req.body.thumbnail = (req.file) ? req.file.filename : product.thumbnail;

        await models.Products.update(
            req.body,
            {
                where: {id: req.params.id}
            }
        );
        res.redirect('/admin/products/detail/' + req.params.id);
    } catch (e) {

    }
};

exports.delete_product = async (req, res) => {
    await models.Products.destroy({
        where: {id: req.params.id}
    });
    res.redirect('/admin/products');
};

exports.delete_memo_of_product = async (req, res) => {
    try {
        await models.ProductsMemo.destroy({
            where: {id: req.params.memo_id}
        });

        res.redirect('/admin/products/detail/' + req.params.product_id);
    } catch (e) {
        console.log(e);
    }
};

exports.post_summernote = (req, res) => {
    res.send('/uploads/' + req.file.filename);
};