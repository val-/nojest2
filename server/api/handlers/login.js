var User = require('./../../models/user');

module.exports = (req, res) => {

    User.login(req.body).then(user => {
        req.session.authorizedUser = user;
        res.json({ success: true });
    }).catch((error) => {
        res.json({ error });
    });

};
