const Ject = require('../../models/ject');
const Task = require('../../models/task');

module.exports = (req, res) => {

    const { authorizedUser } = req.session;

    Task.getTaskById(req.params.taskId).then(task => {

        // const { isAdmin } = authorizedUser; TODO
        const isTaskAuthor = authorizedUser.id === task.taskAuthorId;
        const isTaskContractor = authorizedUser.id === task.contractorId;
        let statusFlow = [];

        console.log('task.taskAuthorId: ', task.taskAuthorId);
        console.log('task.contractorId: ', task.contractorId);
        console.log('authorizedUser.id : ', authorizedUser.id );

        if (isTaskAuthor) {
            statusFlow = Task.statusFlowByAuthor;
        } else if (isTaskContractor) {
            statusFlow = Task.statusFlowByContractor;
        }

        console.log('statusFlow: ', statusFlow);

        res.json({
            ...task,
            nextStatusVariants: statusFlow[task.status],
        });

    }).catch(error => {
        res.json({ error });
    });

};
