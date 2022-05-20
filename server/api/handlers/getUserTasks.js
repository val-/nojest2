var Task = require('../../models/task');

module.exports = (req, res) => {

    const { authorizedUser } = req.session;

    Task.getActualTasksByUser(authorizedUser.id).then(resp => {
        res.json(resp);
    }).catch(error => {
        res.json({ error });
    });

};
