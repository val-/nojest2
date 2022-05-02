var User = require('../../models/user');

module.exports = (req, res) => {

    User.setAvatar(req.body).then(user => {
        req.session.authorizedUser = user;
        res.json({ success: true });
    }).catch((error) => {
        res.json({ error });
    });


};
