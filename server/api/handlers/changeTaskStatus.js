var Task = require('./../../models/task');

module.exports = (req, res) => {

    const { taskId, nextStatus } = req.body;

    // TODO permissions check!!!

    Task.changeStatus(
        taskId,
        nextStatus
    ).then(() => {
        res.json({ success: true });
    }).catch((error) => {
        res.json({ error });
    });

};
