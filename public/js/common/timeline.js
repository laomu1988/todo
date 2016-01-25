// 取得该日期的相关信息: 本月天数，上个月天数，本月第一天星期
web.getMonthArray = function (date) {
    var month = date.getMonth() + 1, year = date.getFullYear(), date = date.getDate(), month2 = month - 1, year2 = year, month3 = month + 1, year3 = year;
    self.year = year, self.month = month;
    if (month2 < 1) {
        year2 -= 1;
        month2 = 12;
    }
    if (month3 > 12) {
        month3 = 1;
        year3 += 1;
    }
    var day = getMonthDay(month, year), day2 = getMonthDay(month2, year2);
    var week = (new Date(year + '-' + month + '-1')).getDay() || 7;
    data = {
        year: year,
        month: month,
        day: day,
        month2: month2,
        year2: year2,
        day2: day2,
        month3: month3,
        year3: year3,
        day3: getMonthDay(month3, year3)
    };
    var arr = [];
    for (var i = 0; i < week; i++) {
        arr.unshift({date: year2 + '-' + month2 + '-' + (day2 - i), day: day2 - i, prevmonth: true});
    }
    for (var i = 1; i <= day; i++) {
        arr.push({date: year + '-' + month + '-' + i, day: i, choosed: i == date});
    }
    i = 1;
    while (arr.length < 42) {
        arr.push({date: year3 + '-' + month3 + '-' + i, day: i, nextmonth: true});
        i += 1;
    }
    return arr;
};

function getMonthDay(month, year) {
    if (month == 2) {
        if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) {
            return 29;
        } else {
            return 28;
        }
    } else {
        switch (month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return 31;
            default:
                return 30;
        }
    }
}