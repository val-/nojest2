const db = require('./../config/database');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const activationLinkLetter = require('../letters/activationLink');

const validateUserData = data => new Promise((resolve, reject) => {
    if (!data.password || !data.email) {
        reject('email and/or password missing');
    } else {
        validatePassword(data.password).then(
            () => validateEmail(data.email)
        ).then(resolve).catch(reject);
    }
});

const validateProfileData = data => new Promise((resolve, reject) => {
    if (!data.email) {
        reject('email missing')
    } else if (!data.fullName) {
        reject('Full name missing')
    } else {
        resolve();
    }
});

const validateEmail = email => new Promise((resolve, reject) => {
    if (typeof (email) !== 'string') {
        reject('email must be a string');
    } else {
        const re = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
        if (re.test(email)) {
            resolve();
        } else {
            reject('provided email does not match proper email format');
        }
    }
});

const validatePassword = password => new Promise((resolve, reject) => {
    if (typeof (password) !== 'string') {
        reject('password must be a string');
    } else if (password.length < 6) {
        reject('password must be at least 6 characters long');
    } else {
        resolve();
    }
});

const hashPassword = password => new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            reject(err);
        } else {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        }
    });
});

const findUserByEmail = email => new Promise(function(resolve, reject) {
    
    // db.query(
    //     'EXPLAIN SELECT * FROM nj_user WHERE email = $1',
    //     [email]
    // ).then(result => {
    //     console.log('EXPLAIN: ', JSON.stringify(result, '', 2));
    // });

    db.query(
        'SELECT * FROM nj_user WHERE email = $1',
        [email]
    ).then(result => {
        const user = result.rows[0];
        if (user) {
            if (user.email_confirmed) {
                resolve(user);
            } else {
                reject('E-mail not confirmed');
            }
        } else {
            reject('Authorization error');
        }
    }, () => {
        reject('Authorization error');
    });
});

const verifyPassword = (password, user) => new Promise(function(resolve, reject) {
    bcrypt.compare(password, user.password_hash, (err, result) => {
        if (result) {
            resolve(user);
        } else {
            reject('Authorization error');
        }
    });
});

const generateUserProfile = user => new Promise(function(resolve) {
    const profile = {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        avatar: user.avatar,
    };
    if (user.phone_number !== 'NULL') {
        profile.phoneNumber = user.phone_number;
    }
    resolve(profile);
});

module.exports = {

    login: (data) => new Promise((resolve, reject) => {
        if (!data.email || !data.password) {
            reject('Email or password missing');
        } else {
            findUserByEmail(data.email).then(
                user => verifyPassword(data.password, user)
            ).then(generateUserProfile).then(resolve).catch(() => {
                reject('Authorization error');
            });
        }
    }),

    getInfoById: userId => new Promise((resolve, reject) => {

        db.query(
            'SELECT avatar, full_name FROM nj_user WHERE id = $1',
            [userId]
        ).then(result => {
            const user = result.rows[0];
            if (user) {
                resolve({
                    avatar: user.avatar,
                    fullName: user.full_name,
                });
            } else {
                reject('getInfoById() method error: user not exist');
            }
        }, () => {
            reject('getInfoById() method error');
        }) 

    }),

    create: (data, siteUrl) => new Promise((resolve, reject) => {
        const token = crypto.randomBytes(32).toString('hex');
        validateUserData(data).then(
            () => hashPassword(data.password)
        ).then((passwordHash) => db.query(
            `
                INSERT INTO nj_user (
                    email,
                    email_confirmed,
                    email_confirm_token,
                    password_hash,
                    full_name
                ) VALUES ($1, $2, $3, $4, $5) returning id
            `,
            [
                data.email,
                false,
                token,
                passwordHash,
                data.fullName
            ]
        )).then(() => activationLinkLetter(
            data.email,
            `${siteUrl}/activation/${token}`
        )).then(resolve).catch(reject);
    }),

    update: (data) => new Promise((resolve, reject) => {
        const {
            email,
            fullName,
            phoneNumber
        } = data;

        // db.query(
        //     `
        //         EXPLAIN
        //         UPDATE nj_user
        //         SET full_name = $2, phone_number = $3
        //         WHERE email = $1
        //     `,
        //     [
        //         email,
        //         fullName,
        //         phoneNumber || 'NULL',
        //     ]
        // ).then(result => {
        //     console.log('EXPLAIN: ', JSON.stringify(result, '', 2));
        // });

        db.query(
            'EXPLAIN SELECT * FROM nj_user WHERE email = $1',
            [email]
        ).then(result => {
            console.log('EXPLAIN: ', JSON.stringify(result, '', 2));
        });

        validateProfileData(data).then(() => db.query(
            `
                UPDATE nj_user
                SET full_name = $2, phone_number = $3
                WHERE email = $1
            `,
            [
                email,
                fullName,
                phoneNumber || 'NULL',
            ]
        )).then(() => {
            findUserByEmail(email).then(user => {
                resolve(generateUserProfile(user));
            }, reject)
        }).catch(reject);
    }),

    setAvatar: data => new Promise((resolve, reject) => {
        const {
            email,
            avaBase64,
        } = data;
        db.query(
            `
                UPDATE nj_user
                SET avatar = $2
                WHERE email = $1
            `,
            [
                email,
                avaBase64
            ]
        ).then(() => {
            findUserByEmail(email).then(user => {
                resolve(generateUserProfile(user));
            }, reject);
        }).catch(reject);
    }),

    activation: (token) => new Promise((resolve, reject) => {
        db.query(
            'SELECT id FROM nj_user WHERE email_confirm_token = $1',
            [ token ]
        ).then(result => {
            if (result.rows[0]) {
                const { id } = result.rows[0];
                return db.query(
                    'UPDATE nj_user SET email_confirmed = TRUE WHERE id = $1',
                    [ id ]
                );
            } else {
                reject('User not found');
            }
        }).then(resolve).catch(reject);
    }),

};
