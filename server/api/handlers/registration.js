var User = require('./../../models/user');

module.exports = (req, res) => {

    const siteUrl = req.protocol + '://' + req.get('host');

    User.create(req.body, siteUrl).then(() => {
        res.json({ success: true });
    }).catch((error) => {
        res.json({ error });
    });

};
