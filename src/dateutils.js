const XDate = require('xdate');

function sameMonth(a, b) {
    return a instanceof XDate && b instanceof XDate &&
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth();
}

function sameDate(a, b) {
    return a instanceof XDate && b instanceof XDate &&
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}

function isGTE(a, b) {
    return b.diffDays(a) > -1;
}

function isLTE(a, b) {
    return a.diffDays(b) > -1;
}

function fromTo(a, b) {
    var days = [];
    var from = +a, to = +b;
    for (; from <= to; from = new XDate(from, true).addDays(1).getTime()) {
        days.push(new XDate(from, true));
    }
    return days;
}

function month(xd) {
    var year = xd.getFullYear(), month = xd.getMonth();
    var days = new Date(year, month + 1, 0).getDate();

    var firstDay = new XDate(year, month, 1, 0, 0, 0, true);
    var lastDay = new XDate(year, month, days, 0, 0, 0, true);

    return fromTo(firstDay, lastDay);
}

function weekDayNames(firstDayOfWeek = 0) {
    let weekDaysNames = XDate.locales[XDate.defaultLocale].dayNamesShort;
    const dayShift = firstDayOfWeek % 7;
    if (dayShift) {
        weekDaysNames = weekDaysNames.slice(dayShift).concat(weekDaysNames.slice(0, dayShift));
    }
    return weekDaysNames;
}

function page(xd, firstDayOfWeek) {
    var days = month(xd), before = [], after = [];

    var fdow = ((7 + firstDayOfWeek) % 7) || 7;
    var ldow = (fdow + 6) % 7;

    firstDayOfWeek = firstDayOfWeek || 0;

    var from = days[0].clone();
    if (from.getDay() !== fdow) {
        from.addDays(-(from.getDay() + 7 - fdow) % 7);
    }

    var to = days[days.length - 1].clone();
    var day = to.getDay();
    if (day !== ldow) {
        to.addDays((ldow + 7 - day) % 7);
    }

    if (isLTE(from, days[0])) {
        before = fromTo(from, days[0]);
    }

    if (isGTE(to, days[days.length - 1])) {
        after = fromTo(days[days.length - 1], to);
    }

    return before.concat(days.slice(1, days.length - 1), after);
}

function isWeekend(xd) {
    var day = xd.getDay();
    return (day === 6 || day === 0)
}

module.exports = {
    weekDayNames,
    sameMonth,
    sameDate,
    month,
    page,
    fromTo,
    isLTE,
    isGTE,
    isWeekend
};
