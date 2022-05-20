

var Message = require('../../models/message');

module.exports = (req, res) => {

    Message.waitLettersByTask(req.params.taskId).then(resp => {
        res.json(resp);
    });

};
