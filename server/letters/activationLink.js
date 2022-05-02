const nodemailer = require('nodemailer');
const secretMailSettings = require('../../secret-mail-settings.json');

module.exports = (recipient, link) => new Promise((resolve, reject) => {

    const transporter = nodemailer.createTransport(secretMailSettings);

    transporter.sendMail({
        from: secretMailSettings.auth.user,
        to: recipient,
        subject: 'Profile activation',
        text:
`Hello!
Someone, hopefully you, signed up for a new account at nojest using this email address.
If it was you, and you'd like to activate and use your account, click the link below or copy and paste it into your web browser's address bar:
${link}`
    }, error => {
        if (error) {
            reject(error);
        } else {
            resolve();
        }
    });

});
