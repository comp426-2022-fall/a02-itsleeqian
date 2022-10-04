#!/usr/bin/env node

import minimist from "minimist"
import moment from "moment-timezone"
import fetch from "node-fetch"

const args = minimist(process.argv.slice(2));

var timezone = moment.tz.guess();

if (args.h) {
	console.log(`
		Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
			 -h            Show this help message and exit.
			 -n, -s        Latitude: N positive; S negative.
			 -e, -w        Longitude: E positive; W negative.
			 -z            Time zone: uses tz.guess() from moment-timezone by default.
			 -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
			 -j            Echo pretty JSON from open-meteo API and exit.
	`);
}

let longitude = 79;
let latitude = 35;

// Latitude
if (args.n) {
	latitude = args.n;
}
else if (args.s) {
	latitude = -args.s;
}

// Longitude
if (args.e) {
	longitude = args.e;
} 
else if (args.w) {
	longitude = -args.w;
}

// Timezone
if (args.z) {
	timezone = args.z;
}

// Days
var days = 1;
if (args.d >= 0) {
	days = args.d;
}

// URL
let url = "https://api.open-meteo.com/v1/forecast?";
url = url + 'latitude=' + latitude + '&longitude=' + longitude + "&timezone=" + timezone + "&daily=precipitation_hours";
//console.log(url); //for checking of values

// Make a request
const response = await fetch(url);

// Get the data from the request
const data = await response.json();

// Either echo JSON and exit or print galosh message
if (args.j) {
	console.log(data);
} else {
	let precipitation = data.daily.precipitation_hours[days];
	let outputMessage = "";
	if (precipitation > 0) {
		outputMessage += "You might need your galoshes ";
	} else {
		outputMessage += "You will not need your galoshes ";
	}
	if (days == 0) {
		outputMessage += "today.";
	} else if (days > 1) {
		outputMessage += "in " + days + " days.";
	} else {
		outputMessage += "tomorrow.";
	}
	console.log(outputMessage);
}






