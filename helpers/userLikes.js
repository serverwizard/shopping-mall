const models = require('../models');

// 사용자가 좋아요 눌렀던 제품들의 id를 받아다가 배열로 받아서 리턴
module.exports = async (req) => {
    const userLikes = [];
    if (req.isAuthenticated()) {
        // TODO 코드 개선이 필요한 부분 (만약 사용자가 좋아요 누른 제품이 500개라면, 500개를 항상 가지고 다녀야하는 문제가 발생)
        const user = await models.User.findOne({
            where: {id: req.user.id},
            include: ['Likes'],
            attributes: ['id']
        });

        // 실제 값은 dataValues라는 프로퍼티 안에 있음
        for (let key in user.dataValues.Likes) {
            userLikes.push(user.dataValues.Likes[key].id)
        }
    }
    return userLikes;
};