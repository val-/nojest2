const db = require('./../config/database');

const Task = require('./task');

const validateJectData = data => new Promise((resolve, reject) => {
    if (!data.title) {
        reject('Title missing');
    } else if (!data.description) {
        reject('Description missing');
    } else {
        resolve();
    }
});

const generateJectData = orderData => ({
    id: orderData.id,
    code: orderData.code,
    title: orderData.title,
    description: orderData.description,
    status: orderData.status,
});

module.exports = {

    create: data => new Promise((resolve, reject) => {
        validateJectData(data).then(() => db.query(
            `
                INSERT INTO nj_ject
                (
                    code,
                    title,
                    description,
                    status
                )
                VALUES ($1, $2, $3, $4)
                returning id
            `,
            [
                data.code,
                data.title,
                data.description,
                'ACTIVE'
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
                reject('Ject create error');
            }
        }).catch(reject);
    }),

    get: jectId => new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM nj_ject WHERE id = $1',
            [jectId]
        ).then(result => {
            const jectData = result.rows[0];
            if (jectData) {
                resolve({
                    id: jectData.id,
                    code: jectData.code,
                    title: jectData.title,
                    description: jectData.description,
                    status: jectData.status,
                });
            } else {
                reject('Ject not found');
            }
        }, () => {
            reject('getJect() method error');
        });
    }),

    getJectWithTasks: jectId => new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM nj_ject WHERE id = $1',
            [jectId]
        ).then(result => {
            const jectData = result.rows[0];

            if (jectData) {
                Task.getActualTasksByJect(jectId).then(tasks => {
                    resolve({
                        id: jectData.id,
                        code: jectData.code,
                        title: jectData.title,
                        description: jectData.description,
                        status: jectData.status,
                        tasks,
                    });
                }, () => {
                    reject('Ject tasks not found');
                })
            } else {
                reject('Ject not found');
            }
        }, () => {
            reject('getJectWithTasks() method error');
        });
    }),

    getJectWithTasksAndHist: jectId => new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM nj_ject WHERE id = $1',
            [jectId]
        ).then(result => {
            const jectData = result.rows[0];

            if (jectData) {
                Task.getActualTasksByJectWithHist(jectId).then(tasks => {
                    resolve({
                        id: jectData.id,
                        code: jectData.code,
                        title: jectData.title,
                        description: jectData.description,
                        status: jectData.status,
                        tasks,
                    });
                }, () => {
                    reject('Ject tasks not found');
                })
            } else {
                reject('Ject not found');
            }
        }, () => {
            reject('getJectWithTasksAndHist() method error');
        });
    }),

    getActualJectsByUser: userId => new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM nj_ject'
        ).then(result => {
            resolve(result.rows.map(generateJectData));
        }, () => {
            reject('getActualJectsByUser() method error');
        });
    }),

};
