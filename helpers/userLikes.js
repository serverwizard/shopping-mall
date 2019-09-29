const models = require('../models');

// 사용자가 좋아요 눌렀던 제품들의 id를 받아다가 배열로 받아서 리턴
module.exports = async (req) => {
    const userLikes = [];
    if (req.isAuthenticated()) {
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