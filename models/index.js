var Sequelize = require('sequelize');
var path = require('path');
var fs = require('fs');
var dotenv = require('dotenv');

dotenv.config(); //LOAD CONFIG

const sequelize = new Sequelize(process.env.DATABASE,
    process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        timezone: '+09:00', //한국 시간 셋팅
        operatorsAliases: Sequelize.Op,
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    });

// 모듈로 사용하기 위해 db 객체를 선언
let db = {};

// TODO models 디렉토리에 있는 index.js 파일을 제외한 모든 파일을 읽어와서 엔티티 만들어 주는 부분
fs.readdirSync(__dirname)
    .filter(file => {
        return file.indexOf('.js') && file !== 'index.js'
    })
    .forEach(file => {
        // 현재 파일이 있는 디렉토리 경로
        console.log(__dirname);
        let model = sequelize.import(path.join(__dirname,
            file));
        db[model.name] = model;
    });

// TODO 해당 코드 때문에 models.Products 처럼 Products 모델에 바로 접근이 가능하다.
Object.keys(db).forEach(modelName => {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;