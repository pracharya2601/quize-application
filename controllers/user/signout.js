const signout = async (req, res, next) => {
    req.session.destroy(function (err) {
        if (err) {
          console.error("--> session destroy failed.err -> ", err);
          res.status(500).json({error: "Something went wronf please try again later"})
          return; 
        }
        res.status(200).json({
          signIn: false,
          user: {},
          alert: {
            text: 'User not found',
            type: 'danger'
        }  
        }) 
    });
}


exports.signout = signout