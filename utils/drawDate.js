const getDayDate = (dayName) => {
    var date = new Date();
    var now = date.getDay();
    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var day = days.indexOf(dayName.toLowerCase());
    var diff = day - now;
    diff = diff < 0 ? 7 + diff : diff;
    var nextDayTimeStamp = date.getTime() + (1000 * 60 * 60 * 24 * diff);
    const newD = new Date(nextDayTimeStamp)
    return newD.toDateString();
}
const getPrevDate = (dayName) => {
    var date = new Date();
    var now = date.getDay();
    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var day = days.indexOf(dayName.toLowerCase());
    var diff = day - now;
    diff = diff >= 0 ? 7 - diff : (-1) * (diff);
    var prevDrawDate = date.getTime() - (1000 * 60 * 60 * 24 * diff);
    const newD = new Date(prevDrawDate)
    return newD.toDateString();
}

const dailyDraw= () => {
    const time = new Date().getHours();
    let today = new Date();
    if(time >= 22) {
        const tom = new Date(today);
        let dateVal = tom.setDate(tom.getDate() + 1);
        const realDate = new Date(dateVal);
        return realDate.toDateString();
    }
    return today.toDateString();
}
const prevDailyDraw = () => {
    let today = new Date();
    const yest = new Date(today);
    let dateVal = yest.setDate(yest.getDay() - 1);
    const realDate = new Date(dateVal);
    return realDate.toDateString();
}


const drawDate = (type) => {
    const newDate = getDayDate('Friday');
    const dailyDate = dailyDraw();
    return type === 'weekly' ? newDate : dailyDate;
}
const prevDrawDate = (type) => {
    const newDate = getPrevDate('Friday');
    const dailyDate = prevDailyDraw();
    return type === 'weekly' ? newDate : dailyDate;
}

exports.drawDate = drawDate;
exports.prevDrawDate = prevDrawDate;