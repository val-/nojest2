const Ject = require('./../../models/ject');

module.exports = (req, res) => {

    Ject.create({ ...req.body }).then(jectId => {
        res.json({ jectId });
    }).catch((error) => {
        res.json({ error });
    });

};
