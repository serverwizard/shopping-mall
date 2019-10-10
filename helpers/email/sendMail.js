const dotenv = require('dotenv');
dotenv.config(); //LOAD CONFIG
const sgMail = require('@sendgrid/mail');

// 이메일 전송 함수
module.exports = (message) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: message.to,
        from: '노드쇼핑몰관리자<serverwizard89@gmail.com>',
        subject: message.subject,
        html: message.mail_body,
    };

    return sgMail.send(msg);

};