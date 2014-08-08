#!/usr/bin/env node
var moment = require('moment')
var _ = require('underscore')
var argv = require('minimist')(process.argv.slice(2));

var start_date = moment(argv["b"]);
var sentence = argv["s"];
var held = argv["held"]
var awaiting = argv["awaiting"]

module.exports = function (start_date, sentence, hold_begin, hold_end) {
	return start(start_date, sentence, hold_begin, hold_end)
}

function start(start_date, sentence, hold_begin, hold_end) {
	start_date = moment(start_date)
	totalDays = convertTime(start_date, sentence)
	finalDay = start_date.add(totalDays,"days")
	
	held = moment(hold_end).diff(moment(hold_begin), 'days')
	console.log(held)
	finalDay = finalDay.subtract(parseInt(held),"days")
	return finalDay.format("YYYY-MM-DD")
}

// Under Mass GL, months are converted to 30 days, and leap years are counted
// See https://malegislature.gov/Laws/GeneralLaws/PartI/TitleI/Chapter4/Section7 
function convertTime(start, s) {
	t = s.split("/")

	//handle conversion from months to days
	days = parseInt(t[2]) + parseInt(t[1])*30
	
	//for each year
	year = start.year
	for (var i=0; i < t[0]; i++) {
		if (moment([year]).isLeapYear()) {
			days += 366
		} else {
			days += 365
		}
		year++
	}
	return days
}

function jailCredits(h, b) {
	// If there's bail, then you get credit
	if (b) {
		held
	}
	// If no bail, then you don't get credit
	else {

	} 
}

function computeHold(hold_begin) {
	b = hold_begin
	if (b) {
		return moment().diff(moment(b), 'days')
	}
}

// holidays, weekends, service_rules, accept_service_of_process
// sentences
// convert to month, day, year
// day_count
// actual_start_date
// effective_start_date = actual_start_date - credit