const Task = require('../../models/task');

module.exports = (req, res) => {

    const { jectId } = req.body;

    Task.getActualTasksByJect(jectId).then(resp => {
        res.json(resp);
    }).catch(error => {
        res.json({ error });
    });

};