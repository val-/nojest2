

var Message = require('../../models/message');

module.exports = (req, res) => {

    Message.getLettersByTask(req.params.taskId).then(resp => {
        res.json(resp);
    }).catch((error) => {
        res.json({ error });
    });

};
