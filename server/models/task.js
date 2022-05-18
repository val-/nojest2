const db = require('../config/database');

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

module.exports = {

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
                resolve(result.rows[0].id);
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
                resolve(generateTaskData(taskData));
            } else {
                reject('Task not found');
            }
        }, () => {
            reject('getTask() method error');
        });
    }),

    getActualTasksByUser: userId => new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM nj_task'
        ).then(result => {
            resolve(result.rows.map(generateTaskData));
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

};
