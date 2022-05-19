const Ject = require('../../models/ject');
const Task = require('../../models/task');

module.exports = (req, res) => {

    const { authorizedUser } = req.session;

    Task.getTaskById(req.params.taskId).then(task => {

        // const { isAdmin } = authorizedUser; TODO
        const isTaskAuthor = authorizedUser.id === task.taskAuthorId;
        const isTaskContractor = authorizedUser.id === task.contractorId;
        let statusFlow = [];

        if (isTaskAuthor) {
            statusFlow = Task.statusFlowByAuthor;
        } else if (isTaskContractor) {
            statusFlow = Task.statusFlowByContractor;
        }

        res.json({
            ...task,
            nextStatusVariants: statusFlow[task.status],
        });

    }).catch(error => {
        res.json({ error });
    });

};
