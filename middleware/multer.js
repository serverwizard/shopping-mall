//이미지 저장되는 위치 설정
const path = require('path');
const uploadDir = path.join(__dirname, '../uploads'); // uploads 폴더

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

module.exports = multer({ storage: storage });