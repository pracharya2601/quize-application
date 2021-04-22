module.exports = (req, res) => {
    if(!req.session.user) {
        res.status(400).json({
            signIn: false,
            user: {}
        })
        return;
    } else {
        const user = req.session.user;
        req.user = user;
    }
}