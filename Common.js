const panRegExp = new RegExp('^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$');
const validatePan = (e) => {
    e = e.toUpperCase();
    var letter4_valid = /([A,B,C,F,G,H,J,L,P,T])/;
    var letter4 = e.substring(3, 4);
    if ((e === "" || panRegExp.test(e)) && (letter4_valid.test(letter4))) {
        return true;
    } else {
        return false;
    }
}

function validateDate(dateStr) {
    // Check format DD/MM/YYYY
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    if (!regex.test(dateStr)) {
        return false;
    }
    // Split into parts
    const [day, month, year] = dateStr.split('/').map(Number);
    // Check valid day for the month (handles leap years too)
    const date = new Date(year, month - 1, day);
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}



module.exports = {
    validatePan, validateDate
};