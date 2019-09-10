// dynamic import
require('./removeByValue')();

// 서버측 모듈 분리
module.exports = (io) => {

    let userList = []; //사용자 리스트를 저장할곳

    // TODO 귓속말 기능 구현 (socketID를 기억해둬야 함)
    // TODO 특정 룸에게만 메시지 전달 하도록 (룸 기능)
    // connection 은 예약어
    io.on('connection', (socket) => {
        //아래 두줄로 passport의 req.user의 데이터에 접근한다.
        const session = socket.request.session.passport;
        const user = (typeof session !== 'undefined') ? (session.user) : "";

        // userList 필드에 사용자 명이 존재 하지 않으면 삽입
        if (!userList.includes(user.displayname)) {
            userList.push(user.displayname);
        }
        io.emit('join', userList);

        //사용자 명과 메시지를 같이 반환한다.
        socket.on('client message', (data) => {
            io.emit('server message', {message: data.message, displayname: user.displayname});
        });

        // disconnect 는 예약어
        socket.on('disconnect', () => {
            userList.removeByValue(user.displayname);
            // TODO 누구누구님이 대화방에서 나가셨습니다.
            io.emit('leave', userList);
        });

    });
};


