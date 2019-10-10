// uuid 라이브러리에는 다양한 옵션들이 존재, 찾아볼 것
const uuidv1 = require('uuid/v1');

// 아이디 + 고유키로 중복 방지
module.exports = (user_id) => user_id + uuidv1();