const models = require('../../models');

exports.get_contacts = async (req, res) => {
    try {
        const contacts = await models.Contacts.findAll();
        res.render('contacts/list.html', {contacts: contacts});
    } catch (e) {
        console.error(e);
    }
};

exports.get_write = (req, res) => {
    res.render('contacts/form.html', {csrfToken: req.csrfToken()});
};

exports.post_write = async (req, res) => {
    try {
        req.body.certificate = (req.file) ? req.file.filename : "";
        await models.Contacts.create(req.body);
        res.redirect('/contacts');
    } catch (e) {
        console.error(e);
    }
};

exports.get_detail = async (req, res) => {
    try {
        const contact = await models.Contacts.findOne({
            where: {id: req.params.id},
            include: ['Memo']
        });

        res.render('contacts/detail.html', {contact});
    } catch (e) {
        console.error(e);
    }
};

exports.post_detail = async (req, res) => {
    try {
        const contact = await models.Contacts.findByPk(req.params.id);
        await contact.createMemo(req.body);

        res.redirect('/contacts/detail/' + req.params.id);
    } catch (e) {
        console.error(e);
    }
};

exports.delete_contacts = async (req, res) => {
    try {
        await models.Contacts.destroy({
            where: {id: req.params.id}
        });

        res.redirect('/contacts');
    } catch (e) {
        console.error(e);
    }
};

exports.delete_memo_of_contacts = async (req, res) => {
    try {
        await models.ContactsMemo.destroy({
            where: {id: req.params.memo_id},
        });

        res.redirect('/contacts/detail/' + req.params.contact_id);
    } catch (e) {
        console.error(e);
    }
};

exports.get_edit = async (req, res) => {
    try {
        const contact = await models.Contacts.findByPk(req.params.id);

        res.render('contacts/form.html', {contact, csrfToken: req.csrfToken()})
    } catch (e) {
        console.error(e);
    }
};

exports.post_edit = async (req, res) => {
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
};
