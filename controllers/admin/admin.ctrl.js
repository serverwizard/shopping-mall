const models = require('../../models');

const paginate = require('express-paginate');

// TODO 누구누구님이 좋아요 했습니다. 구현할 것
/**
 * offset : 시작지점
 */
exports.get_products = async (req, res) => {

    try {

        const [products, totalCount] = await Promise.all([

            models.Products.findAll({
                include: [
                    {
                        model: models.User,
                        as: 'Owner',
                        attributes: ['username', 'displayname']
                    },
                ],
                limit: req.query.limit,
                offset: req.offset,
                order: [['created_at', 'DESC']]
            }),

            models.Products.count()
        ]);

        const pageCount = Math.ceil(totalCount / req.query.limit);

        // 페이지 번호의 목록을 가져옴 (아래에 총 4개의 페이지 번호만 노출됨)
        // 함수 호출의 결과가 함수여서, 따라서 ()() 식 구조가 나옴
        //    -> 이렇게 사용하는 이유는 클로저 개념을 이용하기 위해
        // 클로저를 이용하면 편한 경우가 몇몇 경우가 있다. (페이지네이션)
        /**
         *
         * function test(req) {
         *     var result = 0;
         *     return function(num) {
         *         return result+num;
         *     }
         * }
         *
         * test(1)(2);
         * test(1)(2);
         * test(1)(2);
         * test(1)(2);
         */
        const pages = paginate.getArrayPages(req)(4, pageCount, req.query.page);

        res.render('admin/products.html', {products, pages, pageCount});

    } catch (e) {
        console.log(e);
    }
};

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
    try {
        const product = await models.Products.findOne({
            where: {id: req.params.id},
            include: [
                {model: models.Tag, as: 'Tag'} // as 가 중요함, as명 안적고 접근할 수 있는 방법도 확인해 볼것
            ],
            order: [
                ['Tag', 'createdAt', 'desc'] // Products 안의 Tag 들을 desc로 정렬 해줌
            ]
        }); // Products

        res.render('admin/form.html', {product, csrfToken: req.csrfToken()});

    } catch (e) {

    }
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

exports.get_write = (req, res) => {
    res.render('admin/form.html', {csrfToken: req.csrfToken()});
};

exports.post_write = async (req, res) => {

    try {
        req.body.thumbnail = (req.file) ? req.file.filename : "";
        // 유저를 가져온다음에 저장
        const user = await models.User.findByPk(req.user.id);
        await user.createProduct(req.body);

        // 이런식으로 사용해도 되지만... 어떤게 더 의미가 있는지 고민해볼 것
        // req.body.thumbnail = (req.file) ? req.file.filename : "";
        // req.user_id = req.user.id;
        // await models.Products.create(req.body);

        res.redirect('/admin/products');

    } catch (e) {
        console.log(e);
    }
};

exports.get_order = async (req, res) => {
    try {

        const checkouts = await models.Checkout.findAll();
        res.render('admin/order.html', {checkouts});

    } catch (e) {

    }
};

exports.get_order_edit = async (req, res) => {
    try {

        const checkout = await models.Checkout.findByPk(req.params.id);
        res.render('admin/order_edit.html', {checkout});

    } catch (e) {

    }
};

exports.post_order_edit = async (req, res) => {
    try {

        await models.Checkout.update(
            req.body,
            {
                where: {id: req.params.id}
            }
        );

        res.redirect('/admin/order');

    } catch (e) {

    }
};

exports.statistics = async (_, res) => {
    try {
        const barData = await models.Checkout.findAll({
            attributes: [
                // 시퀄라이즈에서 제공하는 메소드만으로는 쿼리가 부족한 경우가 있음. literal() 은 쿼리 문자열을 추가해 주는 기능
                [models.sequelize.literal('date_format( createdAt, "%Y-%m-%d")'), 'date'],
                [models.sequelize.fn('count', models.sequelize.col('id')), 'cnt']
            ],
            group: ['date']
        });

        const pieData = await models.Checkout.findAll({
            attributes: [
                'status',
                [models.sequelize.fn('count', models.sequelize.col('id')), 'cnt']
            ],
            group: ['status']
        });

        res.render('admin/statistics.html', {barData, pieData});

    } catch (e) {
        console.log(e)
    }
};

exports.write_tag = async (req, res) => {
    try {
        // findOrCreate(), 조회 후에 값이 없으면 생성하고 값이 있으면 그 값을 가져옴 (배열 형태로 리턴)
        // tag[0] : 검색되었거나 또는 생성된 객체, tag[1] : boolean값, 객체가 생성되었을 경우 true, 그렇지 않을 경우 false
        const tag = await models.Tag.findOrCreate({ // Tag
            where: {
                name: req.body.name
            }
        });

        const product = await models.Products.findByPk(req.body.product_id);
        const status = await product.addTag(tag[0]); // TagProduct, status[0][0].dataValues 로 데이터 접근함

        res.json({
            status: status,
            tag: tag[0]
        })

    } catch (e) {
        res.json(e)
    }
};

exports.delete_tag = async (req, res) => {
    try {
        const product = await models.Products.findByPk(req.params.product_id);
        const tag = await models.Tag.findByPk(req.params.tag_id);

        const result = await product.removeTag(tag);

        res.json({
            result: result
        });
    } catch (e) {

    }
};

exports.s3_upload = async (req, res) => {
    try {
        // 이전에 저장되어있는 파일명을 받아오기 위함
        const product = await models.Products.findByPk(req.params.id);

        // 파일요청이면 파일명을 담고 아니면 이전 DB에서 가져온다
        // req.file.location : s3에 저장된 풀 주소
        req.body.thumbnail = (req.file) ? req.file.location : product.thumbnail;

        await models.Products.update(
            req.body, {
                where: {id: req.params.id}
            }
        );
        res.redirect('/admin/products/detail/' + req.params.id);

    } catch (e) {
        console.error(e);
    }
};