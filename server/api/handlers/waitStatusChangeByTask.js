const Task = require('../../models/task');

module.exports = (req, res) => {

    Task.waitStatusChangeByTask(req.params.taskId).then(resp => {
        res.json(resp);
    });

};
