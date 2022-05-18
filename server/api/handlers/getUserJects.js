var Ject = require('../../models/ject');

module.exports = (req, res) => {

    const { authorizedUser } = req.session;

    Ject.getActualJectsByUser(authorizedUser.id).then(resp => {
        res.json(resp);
    }).catch(error => {
        res.json({ error });
    });

};
