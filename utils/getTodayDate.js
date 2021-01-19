const getTodayDate = () => {
    let d = new Date();
    let year = d.getFullYear().toString();
    let month = d.getMonth().toString();
    let day = d.getDate().toString();

    let result = year+month+day
    return result;

}

exports.getTodayDate = getTodayDate;