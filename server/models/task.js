const db = require('../config/database');

const listenersByTask = {};

const notifyListeners = (taskId, dateTime) => {
    if (listenersByTask[taskId]) {
        listenersByTask[taskId].forEach(cb => {
            cb({ lastMessageDateTime: dateTime });
        });
        listenersByTask[taskId] = [];
    }
}

const validateTaskData = data => new Promise((resolve, reject) => {
    if (!data.title) {
        reject('Title missing');
    } else if (!data.description) {
        reject('Description missing');
    } else {
        resolve();
    }
});

const generateTaskData = taskData => ({
    id: taskData.id,
    title: taskData.title,
    description: taskData.description,
    jectId: taskData.ject_id,
    taskAuthorId: taskData.task_author_id,
    contractorId: taskData.contractor_id,
    deadline: taskData.deadline,
    parentId: taskData.parent_id,
    targetVersionId: taskData.target_version_id,
});

const statusFlowByContractor = {
    'OPENED': [ 'ASSIGNED', 'RESOLVED' ],
    'ASSIGNED': [ 'OPENED' ],
    'RESOLVED': [],
    'REOPENED': [ 'ASSIGNED', 'RESOLVED' ],
    'DONE': [],
};

const statusFlowByAuthor = {
    'OPENED': [],
    'ASSIGNED': [],
    'RESOLVED': [ 'DONE', 'REOPENED' ],
    'REOPENED': [],
    'DONE': [],
};

const addTaskHistory = task => new Promise((resolve, reject) => {
    db.query(
        'SELECT * FROM nj_task_history WHERE task_id = $1',
        [ task.id ]
    ).then(result => {
        const history = result.rows.map(
            row => ({
                dateTime: row.date_time,
                id: row.id,
                status: row.status,
                taskId: row.task_id,
            }),
        );
        console.log('history: ', history);
        resolve({
            ...task,
            status: history[history.length-1].status,
            history
        });
    }, () => {
        reject('Task history not found');
    });
});

const addTaskHistoryRecord = (taskId, nextStatus, dateTime) => new Promise((resolve, reject) => {
    db.query(
        `
            INSERT INTO nj_task_history
            (
                task_id,
                date_time,
                status
            )
            VALUES ($1, $2, $3)
            returning id
        `,
        [
            taskId,
            dateTime,
            nextStatus
        ]
    ).then(result => {
        if (
            result &&
            result.rows &&
            result.rows[0] &&
            result.rows[0].id
        ) {
            resolve(result.rows[0].id);
        } else {
            reject('Task history add error');
        }
    }).catch(reject);
});

const changeStatus = (taskId, nextStatus) => new Promise((resolve, reject) => {
    const dateTime = new Date();
    addTaskHistoryRecord(taskId, nextStatus, dateTime).then(resp => {
        notifyListeners(taskId, dateTime);
        resolve(resp);
    }, reject);
});

module.exports = {

    statusFlowByContractor,

    statusFlowByAuthor,

    changeStatus,

    create: data => new Promise((resolve, reject) => {
        validateTaskData(data).then(() => db.query(
            `
                INSERT INTO nj_task
                (
                    title,
                    description,
                    ject_id,
                    task_author_id,
                    contractor_id,
                    deadline,
                    parent_id,
                    target_version_id
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                returning id
            `,
            [
                data.title,
                data.description,
                data.jectId,
                data.taskAuthorId,
                data.contractorId,
                data.deadline,
                data.parentId,
                data.targetVersionId
            ]
        ), reject).then(result => {
            if (
                result &&
                result.rows &&
                result.rows[0] &&
                result.rows[0].id
            ) {
                const newTaskId = result.rows[0].id;
                const dateTime = new Date();
                db.query(
                    `
                        INSERT INTO nj_task_history(
                            task_id,
                            date_time,
                            status
                        )
                        VALUES ($1, $2, $3)
                    `,
                    [
                        newTaskId,
                        dateTime,
                        'OPENED'

                    ]
                ).then(() => {
                    resolve(newTaskId);
                }, reject);
            } else {
                reject('Task create error');
            }
        }).catch(reject);
    }),

    getTaskById: taskId => new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM nj_task WHERE id = $1',
            [taskId]
        ).then(result => {
            const taskData = result.rows[0];
            if (taskData) {
                addTaskHistory(generateTaskData(taskData)).then(resolve, reject)
            } else {
                reject('Task not found');
            }
        }, () => {
            reject('getTask() method error');
        });
    }),

    getActualTasksByUser: userId => new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM nj_task WHERE task_author_id = $1 OR contractor_id = $1',
            [userId]
        ).then(result => {
            Promise.all(result.rows.map(generateTaskData).map(addTaskHistory)).then(resolve, reject);
        }, () => {
            reject('getActualTasksByUser() method error');
        });
    }),

    getActualTasksByJect: jectId => new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM nj_task WHERE ject_id = $1',
            [jectId]
        ).then(result => {
            resolve(result.rows.map(generateTaskData));
        }, () => {
            reject('getActualTasksByJect() method error');
        });
    }),

    getActualTasksByJectWithHist: jectId => new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM nj_task WHERE ject_id = $1',
            [jectId]
        ).then(result => {
            Promise.all(result.rows.map(generateTaskData).map(addTaskHistory)).then(resolve, reject);
        }, () => {
            reject('getActualTasksByJect() method error');
        });
    }),

    waitStatusChangeByTask: taskId => new Promise((resolve) => {
        if (!listenersByTask[taskId]) {
            listenersByTask[taskId] = [];
        }
        listenersByTask[taskId].push(resolve);
    }),

};
