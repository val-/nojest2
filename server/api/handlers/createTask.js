const Task = require('../../models/task');

module.exports = (req, res) => {

    const { authorizedUser } = req.session;
    const taskAuthorId = authorizedUser.id;

    Task.create({ ...req.body, taskAuthorId }).then(taskId => {
        res.json({ taskId });
    }).catch((error) => {
        res.json({ error });
    });

};
