var User = require('./../../models/user');

module.exports = (req, res) => {

    User.activation(req.body.token).then(() => {
        res.json({ success: true });
    }).catch((error) => {
        res.json({ error });
    });

};
