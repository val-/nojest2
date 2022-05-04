const Ject = require('../../models/ject');

module.exports = (req, res) => {

    Ject.get(req.params.jectId).then(resp => {
        res.json({ ...resp });
    }).catch(error => {
        res.json({ error });
    });

};
