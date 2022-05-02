module.exports = (req, res) => {

    req.session.authorizedUser = false;
    res.json({ success: true });

};
