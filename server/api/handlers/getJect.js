const Ject = require('../../models/ject');

module.exports = (req, res) => {

    //Ject.getJectWithTasks(req.params.jectId).then(resp => {
    Ject.getJectWithTasksAndHist(req.params.jectId).then(resp => {
        res.json({ ...resp });
    }).catch(error => {
        res.json({ error });
    });

};
