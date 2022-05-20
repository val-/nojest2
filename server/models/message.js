const db = require('./../config/database');

const listenersByTask = {};

function notifyListeners(taskId, dateTime) {
    if (listenersByTask[taskId]) {
        listenersByTask[taskId].forEach(cb => {
            cb({ lastMessageDateTime: dateTime });
        });
        listenersByTask[taskId] = [];
    }
}

module.exports = {

    sendLetter: data => new Promise((resolve, reject) => {
        db.query(
            `
                INSERT INTO nj_task_message
                (
                    author_id,
                    task_id,
                    date_time,
                    letter
                )
                VALUES ($1, $2, $3, $4)
                returning id
            `,
            [
                data.authorId,
                data.taskId,
                data.dateTime,
                data.letter,
            ]
        ).then(result => {
            if (
                result &&
                result.rows &&
                result.rows[0] &&
                result.rows[0].id
            ) {
                notifyListeners(data.taskId, data.dateTime);
                resolve(result.rows[0].id);
            } else {
                reject('Send letter error');
            }
        }, () => {
            reject('sendLetter() method error');
        });
    }),

    getLettersByTask: taskId => new Promise((resolve, reject) => {
        db.query(
            'SELECT id, author_id, date_time, letter FROM nj_task_message WHERE task_id = $1',
            [taskId]
        ).then(result => {
            resolve(result.rows.map(row => ({
                id: row.id,
                authorId: row.author_id,
                dateTime: row.date_time,
                letter: row.letter,
            })));
        }, () => {
            reject('getLettersByTask() method error');
        });
    }),

    waitLettersByTask: taskId => new Promise((resolve) => {
        if (!listenersByTask[taskId]) {
            listenersByTask[taskId] = [];
        }
        listenersByTask[taskId].push(resolve);
    }),

};
