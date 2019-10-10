const dotenv = require('dotenv');
dotenv.config(); // LOAD CONFIG

// css 적용된 이메일 내용을 보낼때 받는 inline css로 적어줘야함
module.exports = (sign_url) => (`
    <div style="width:70%; margin:0 auto; padding:40px; border:5px solid #eee; background-color:#fff; font-size:9pt; min-width:600px;">
        <p style="margin:0; padding:0; text-align:left; padding:20px 0; border-top:6px solid #009de2;"></p>
        <div style="padding:50px 20px; background-color:#f5f5f1; text-align:center;">
            <p style="margin:0; padding:0; font-size:10pt;"><b style="font-weight:bold; font-size:1.3em; color:#009de2; display:block; margin-bottom:5px;">
                serverwizard 노드쇼핑몰 가입 인증 메일입니다.</b>아래 링크를 클릭하여 인증을 완료해주세요.
            </p>
 
            <div style="padding:20px; border:1px solid #eee; background-color:#fff; width:70%; margin:20px auto 0; word-break:break-all; white-space:breal-all;">
                <a style="color:#777;" href="${sign_url}">${sign_url}</a>
            </div>
 
            <p style="margin-top:20px;"><a style="padding:10px 30px; margin:0 auto; text-align:center; background-color:#333; color:#fff; border-radius:10px; font-size:9pt;" href="${process.env.SITE_DOMAIN}">serverwizard 노드쇼핑몰 바로가기</a></p>
 
            <p style="margin:0; padding:0; color:#999; margin-top:20px;">Copyright &copy; serverwizard 노드쇼핑몰 All Rights Reserved </p>
 
        </div>
 
    </div>
`)