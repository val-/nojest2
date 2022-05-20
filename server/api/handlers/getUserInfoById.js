var User = require('./../../models/user');

module.exports = (req, res) => {

    User.getInfoById(req.params.userId).then(resp => {
        res.json(resp);
    }).catch((error) => {
        res.json({ error });
    });

};
