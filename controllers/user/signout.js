const signout = async (req, res, next) => {
    req.session.destroy(function (err) {
        if (err) {
          console.error("--> session destroy failed.err -> ", err);
          res.status(500).json({error: "Something went wronf please try again later"})
          return; 
        }
        console.log(req.session)
        res.status(200).json({message: "Sign out successfully"}) 
    });
}


exports.signout = signout;