var isWeekend = function(day){
	if (day.isoWeekday() == 6 || day.isoWeekday() == 7) return true;
	else return false;
}

var isHoliday = function(day){
	return true;
}

module.exports = isWeekend