var bcrypt = require('bcrypt');

const hashPass = async (password) => {
    var saltRounds = 10;
    return await bcrypt.hash(password, saltRounds)
}

const hashCompare = async (newPass, hash) => {
   return await bcrypt.compare(newPass, hash);
}


exports.hashPass = hashPass;
exports.hashCompare = hashCompare;