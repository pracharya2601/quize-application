

const signout = async (req, res, next) => {
    req.session.destroy();
    res.status(200).json({message: "Sign out successfully"})
        
}


exports.signout = signout;