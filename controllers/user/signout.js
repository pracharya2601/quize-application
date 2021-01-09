

const signout = async (req, res, next) => {
    if(req.session.user) {
        console.log(req.session.cookie);
        req.session.user= null;
    }
    // delete req.session;
    res.status(200).json({message: "Sign out successfully"})
        
}


exports.signout = signout;