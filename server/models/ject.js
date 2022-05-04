const db = require('./../config/database');

const validateOrderData = data => new Promise((resolve, reject) => {
    if (!data.title) {
        reject('Title missing');
    } else if (!data.description) {
        reject('Description missing');
    } else {
        resolve();
    }
});

module.exports = {

    create: data => new Promise((resolve, reject) => {
        validateOrderData(data).then(() => db.query(
            `
                INSERT INTO nj_ject
                (
                    title,
                    description,
                    status
                )
                VALUES ($1, $2, $3)
                returning id
            `,
            [
                data.title,
                data.description,
                'ACTIVE',
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
                reject('Order create error');
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
                    title: jectData.title,
                    description: jectData.description,
                    status: jectData.status,
                });
            } else {
                reject('Order not found');
            }
        }, () => {
            reject('getOrder() method error');
        });
    }),

};
