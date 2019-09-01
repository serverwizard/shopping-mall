const express = require('express');
const router = express.Router();
const models = require('../models');

const csrf = require('csurf');
const csrfProtection = csrf({cookie: true});

const path = require('path');
const uploadDir = path.join(__dirname, '../uploads');
const fs = require('fs');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, callback) => { //이미지가 저장되는 경로
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => { // products-날짜.jpg(png) 저장
        // TODO 파일 이름이 겹치는 경우, 엎어 침
        callback(null, 'contacts-' + Date.now() + '.' + file.mimetype.split('/')[1]);
    }
});
const upload = multer({storage: storage});

router.get('/', async (req, res) => {
    try {
        const contacts = await models.Contacts.findAll();
        res.render('contacts/list.html', {contacts: contacts});
    } catch (e) {
        console.error(e);
    }
});

router.get('/write', csrfProtection, (req, res) => {
    res.render('contacts/form.html', {csrfToken: req.csrfToken()});
});

router.post('/write', upload.single('certificate'), csrfProtection, async (req, res) => {
    try {
        req.body.certificate = (req.file) ? req.file.filename : "";
        await models.Contacts.create(req.body);
        res.redirect('/contacts');
    } catch (e) {
        console.error(e);
    }
});

router.get('/detail/:id', async (req, res) => {
    try {
        const contact = await models.Contacts.findOne({
            where: {id: req.params.id},
            include: ['Memo']
        });

        res.render('contacts/detail.html', {contact});
    } catch (e) {
        console.error(e);
    }
});

router.get('/delete/:id', async (req, res) => {
    try {
        await models.Contacts.destroy({
            where: {id: req.params.id}
        });

        res.redirect('/contacts');
    } catch (e) {
        console.error(e);
    }
});

router.post('/detail/:id', async (req, res) => {
    try {
        const contact = await models.Contacts.findByPk(req.params.id);
        await contact.createMemo(req.body);

        res.redirect('/contacts/detail/' + req.params.id);
    } catch (e) {
        console.error(e);
    }
});

router.get('/edit/:id', csrfProtection, async (req, res) => {
    try {
        const contact = await models.Contacts.findByPk(req.params.id);

        res.render('contacts/form.html', {contact, csrfToken: req.csrfToken()})
    } catch (e) {
        console.error(e);
    }
});

router.post('/edit/:id', upload.single('certificate'), csrfProtection, async (req, res) => {
    try {
        const contact = await models.Contacts.findByPk(req.params.id);

        if (req.file && contact.certificate) {  // 기존 파일이 존재 하면 기존 이미지 삭제
            fs.unlinkSync(uploadDir + '/' + contact.certificate);
        }

        req.body.certificate = req.file ? req.file.filename : contact.certificate;

        await models.Contacts.update(req.body, {
            where: {id: req.params.id}
        });

        res.redirect('/contacts/detail/' + req.params.id);
    } catch (e) {
        console.error(e);
    }
});

router.get('/delete/:contact_id/:memo_id', async (req, res) => {
    try {
        await models.ContactsMemo.destroy({
            where: {id: req.params.memo_id},
        });

        res.redirect('/contacts/detail/' + req.params.contact_id);
    } catch (e) {
        console.error(e);
    }
});

module.exports = router;

