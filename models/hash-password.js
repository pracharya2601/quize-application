var bcrypt = require('bcryptjs');

const hashPass = (password) => {
    var salt = bcrypt.genSaltSync(12);
    return bcrypt.hashSync(password, salt);
}

const hashCompare = (storedPass, newPass) => {
   return bcrypt.compareSync(newPass, storedPass);
}

exports.hashPass = hashPass;
exports.hashCompare = hashCompare;