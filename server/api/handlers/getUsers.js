var User = require('../../models/user');

module.exports = (req, res) => {

    const { authorizedUser } = req.session;

    if (authorizedUser) {
        User.getUsersList().then(resp => {
            res.json(resp);
        }).catch(error => {
            res.json({ error });
        });
    } else {
        res.json({ error: 'Not authorized' });
    }

};
