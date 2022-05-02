module.exports = (req, res) => {

    const { authorizedUser } = req.session;
    res.json({ authorizedUser });

};