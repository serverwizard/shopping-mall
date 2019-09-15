const models = require('../../models');
const paginate = require('express-paginate');

/**
 * offset : 시작지점
 */
exports.get_products = async (req,res) => {

    try{

        const [ products, totalCount ] = await Promise.all([

            models.Products.findAll({
                include : [
                    {
                        model : models.User ,
                        as : 'Owner',
                        attributes : [ 'username' , 'displayname' ]
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

    }catch(e){
        console.log(e);
    }
};

exports.get_write = ( req , res ) => {
    res.render( 'admin/form.html' , { csrfToken : req.csrfToken() });
};

exports.post_write = async (req,res) => {

    try{
        req.body.thumbnail = (req.file) ? req.file.filename : "";
        // 유저를 가져온다음에 저장
        const user = await models.User.findByPk(req.user.id);
        await user.createProduct(req.body);

        // 이런식으로 사용해도 되지만... 어떤게 더 의미가 있는지 고민해볼 것
        // req.body.thumbnail = (req.file) ? req.file.filename : "";
        // req.user_id = req.user.id;
        // await models.Products.create(req.body);

        res.redirect('/admin/products');

    }catch(e){
        console.log(e);
    }
};