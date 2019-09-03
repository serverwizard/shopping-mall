var crypto = require('crypto');
var mysalt = "fastcampus";

/**
 * 디비를 털리더라도, salt값을 통해 원본 비밀번호와는 다르게 만듦
 * 소스 코드까지 털리면, 그 땐 어쩔 수 없음
 */
module.exports = (password) => {
    return crypto.createHash('sha512').update(password + mysalt).digest('base64');
};