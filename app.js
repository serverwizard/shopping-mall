/**
 * npm start, npm test를 제외하고,
 * 나머지는 npm run dev 처럼 중간에 run을 붙여줘야 함
 *
 * nodemon을 설치해줬는데, 이는 서버에 변화가 있을 때
 * 자동으로 서버를 내렸다 올려주기 위해서
 *
 * npx는 글로벌 모듈을 자기가 직접 다운받고 실행시켜줌
 * 소스코드를 줄 때 어떤 글로벌 모듈이 필요하다는 것을
 * 안 알려줘도 된다
 *
 * 우리가 만든 app을 오버라이딩 시키지 않기 위해, router를 만들어서 export 시켜준거다
 * app을 export 해줘도 되는데, 그럼 app이 오버라이딩 되서 덮어씌워진다.
 */

const express = require('express');
const admin = require('./routes/admin');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
   res.send('express framework');
});

/**
 * 미들웨어 사용 부분
 */
app.use('/admin', admin);

// app.get('/admin', (req, res) => {
//    res.send('admin page');
// });


app.listen(port, () => {
   console.log('Express listening on port', port);
});

