const Ject = require('../../models/ject');
const Task = require('../../models/task');

module.exports = (req, res) => {

    Task.getTaskById(req.params.taskId).then(task => {

        Ject.get(task.jectId).then(ject => {

            res.json({
                ...task,
                ject,
            });

        }).catch(error => {
            res.json({ error });
        });

    }).catch(error => {
        res.json({ error });
    });

};
