module.exports = () => {
    // TODO lodash 이용하면 간단 (자바스크립트에서 제공하지 않는 함수들을 많이 제공함)
    // 많은 라이브러리에서 lodash 를 들고 시작함
    // arrow function 으로 했을 때는 안돌아감 (this 문제인 듯)
    Array.prototype.removeByValue = function (search) {
        // 해당하는 index 구함
        let index = this.indexOf(search);
        console.log(index);
        if (index !== -1) {
            // index 위치의 한 개 요소 제거
            this.splice(index, 1);
        }
    };
};