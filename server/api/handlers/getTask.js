const Ject = require('../../models/ject');
const Task = require('../../models/task');

module.exports = (req, res) => {

    const { authorizedUser } = req.session;

    Task.getTaskById(req.params.taskId).then(task => {

        Ject.get(task.jectId).then(ject => {

            res.json({
                ...task,
                ject,
            });
/*
            const ownJect = authorizedUser.id === ject.authorId;
            const ownTask = authorizedUser.id === task.contractorId;
            const { isModerator } = authorizedUser;
            let statusFlow = false;

            if (isModerator) {
                statusFlow = Task.statusFlowByModerator;
            } else if (ownJect) {
                statusFlow = Task.statusFlowByCustomer;
            } else if (ownTask) {
                statusFlow = Task.statusFlowByContractor;
            }
            if (statusFlow) {
                res.json({
                    ...task,
                    ject,
                    nextStatusVariants: statusFlow[task.status],
                });
            } else {
                res.json({ error: 'You have no permissions to view this task' });
            }
*/

        }).catch(error => {
            res.json({ error });
        });

    }).catch(error => {
        res.json({ error });
    });

};
