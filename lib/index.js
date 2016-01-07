'use strict';

const fs = require('fs');
const _ = require('lodash');

console.time('entire process');

function zipData(filename) {
	var dataWithHeaders = fs.readFileSync(`./data/${filename}.csv`)
													.toString()
													.split('\r\n')
													.map(row => row.split(','));

	var headers = _.first(dataWithHeaders);
	var rows = _.rest(dataWithHeaders);

	return _.initial(_.map(rows, function (row){
		return _.zipObject(headers, row);
	}));
}

let organizedData = zipData('traffic-accidents');

function topFiveSort(collection, identifier) {
	return _.slice(_.initial(_.sortBy(_.map(_.groupBy(collection, function(item){
		return item[identifier];
	}), function (category) {
		return [_.first(category)[identifier], category.length];
	}), function (category) {
		return category[1];
	})).reverse(), 0, 5);
}

let sortedGroups = topFiveSort(organizedData, 'INCIDENT_ADDRESS');

let sortedNeighborhoods = topFiveSort(organizedData, 'NEIGHBORHOOD_ID');

let organizedCrime = zipData('crime');

let crimeSortedNeighborhoods = topFiveSort(organizedCrime, 'NEIGHBORHOOD_ID');

console.timeEnd('entire process');

console.log(sortedGroups);

console.log(sortedNeighborhoods);

console.log(crimeSortedNeighborhoods);