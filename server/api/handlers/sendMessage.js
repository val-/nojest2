var Message = require('./../../models/message');

module.exports = (req, res) => {

    const authorId = req.session.authorizedUser.id;
    const { taskId, letter } = req.body;
    const dateTime = new Date();

    Message.sendLetter({
        taskId,
        dateTime,
        letter,
        authorId,
    }).then(messageId => {
        res.json({ messageId });
    }).catch((error) => {
        res.json({ error });
    });

};
