const express = require('express');
const router = express.Router();

const models = require('../models');
const loginRequired = require('../helpers/loginRequired');

const paginate = require('express-paginate');

// csrf 셋팅
const csrf = require('csurf');
const csrfProtection = csrf({cookie: true});

//이미지 저장되는 위치 설정
const path = require('path');
const uploadDir = path.join(__dirname, '../uploads'); // uploads 폴더
const fs = require('fs');

//multer 셋팅
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, callback) => { //이미지가 저장되는 경로
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => { // products-날짜.jpg(png) 저장
        // TODO 파일 이름이 겹치는 경우, 엎어 침
        callback(null, 'products-' + Date.now() + '.' + file.mimetype.split('/')[1]);
    }
});
const upload = multer({storage: storage});

router.get('/', (req, res) => {
    res.send('admin url 입니다.');
});

/**
 * offset : 시작지점
 */
router.get('/products', paginate.middleware(3, 50), async (req, res) => {
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
    }
});

router.get('/products/write', loginRequired, csrfProtection, (req, res) => {
    res.render('admin/form.html', {csrfToken: req.csrfToken()});
});

router.post('/products/write', loginRequired, upload.single('thumbnail'), csrfProtection, async (req, res) => {
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

    }
});

router.get('/products/detail/:id', async (req, res) => {
    const product = await models.Products.findOne({
        where: {
            id: req.params.id
        },
        include: [
            'Memo'
        ]
    });

    res.render('admin/detail.html', {product});
});

router.get('/products/edit/:id', loginRequired, csrfProtection, async (req, res) => {
    const product = await models.Products.findByPk(req.params.id);
    res.render('admin/form.html', {product, csrfToken: req.csrfToken()});
});

router.post('/products/edit/:id', loginRequired, upload.single('thumbnail'), csrfProtection, async (req, res) => {
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

});

router.get('/products/delete/:id', async (req, res) => {
    await models.Products.destroy({
        where: {id: req.params.id}
    });
    res.redirect('/admin/products');
});


router.post('/products/detail/:id', async (req, res) => {
    try {

        const product = await models.Products.findByPk(req.params.id);
        // create + as에 적은 내용 ( Products.js association 에서 적은 내용 )
        await product.createMemo(req.body);
        res.redirect('/admin/products/detail/' + req.params.id);

    } catch (e) {
        console.log(e)
    }
});

router.get('/products/delete/:product_id/:memo_id', async (req, res) => {
    try {
        await models.ProductsMemo.destroy({
            where: {id: req.params.memo_id}
        });

        res.redirect('/admin/products/detail/' + req.params.product_id);
    } catch (e) {
        console.log(e);
    }
});

router.post('/products/ajax_summernote', loginRequired, upload.single('thumbnail'), (req, res) => {
    res.send('/uploads/' + req.file.filename);
});

module.exports = router;