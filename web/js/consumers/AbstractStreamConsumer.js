/*
 * StreamTeam
 * Copyright (C) 2019  University of Basel
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Generic abstract class for consuming elements of a data stream from the KafkaRestProxy
 */
class AbstractStreamConsumer {

	/**
	 * AbstractStreamConsumer constructor.
	 *
	 * @param topic Topic
	 * @param key Key
	 * @param limit Number of data stream elements to comsume periodically
	 * @param interval Interval in which new elements should be consumed (in ms)
	 */
    constructor(topic, key, limit, interval) {
    	this.topic = topic;
    	this.key = key;
    	this.limit = limit;
    	this.interval = interval;
    	this.url = "http://"+Config.KAFKARESTPROXY_IP+":"+Config.KAFKARESTPROXY_PORT+"/consume?t=" + topic + "&k=" + key + "&l=";
    	//console.log(this.url);
    	this.latestOffsets = new Map();

		//https://ilikekillnerds.com/2015/06/abstract-classes-in-javascript/
		//https://stackoverflow.com/questions/4138012/checks-how-many-arguments-a-function-takes-in-javascript
		if(this.constructor === AbstractStreamConsumer) {
			throw new TypeError("AbstractStreamConsumer cannot be instantiated.");
		}
		if(this.handleSuccess === undefined || this.handleSuccess.length !== 1) { // Abstract method: handleSuccess(jsonResult)
			throw new TypeError("Classes extending AbstractStreamConsumer have to implement handleSuccess(jsonResult)")
		}
    }

	/**
	 * Starts the periodical consumption.
	 *
	 * @param firstLimit Number of data stream elements that should be consumed in the first consumption (Default is the limit that is used in all future consumptions)
	 */
	startConsumption(firstLimit = this.limit) {
		this.consume(firstLimit); // immediately first consumption
		this.consumptionIntervalId = setInterval( (function(){this.consume(this.limit);}).bind(this), this.interval);
	}

	/**
	 * Consumes a given number of data stream elements.
	 *
	 * @param limit Number of data stream elements.
	 */
	consume(limit) {
		if (!userInteraction.paused) {
			$.ajax({
				url: this.url + limit,
				dataType: "json",
				statusCode: {
					200: (function (jsonResult) { // OK
						this.handleSuccess(jsonResult);
					}).bind(this),
					204: function (jsonResult) { // NO CONTENT
						//console.log("Error 204 (No Content) for " + this.url);
					},
					422: function (jsonResult) { // UNPROCESSSABLE ENTITY
						console.log(StreamConsumer.errorResultToString(jsonResult));
					},
					501: function (jsonResult) { // NOT IMPLEMENTED
						console.log(StreamConsumer.errorResultToString(jsonResult));
					}
				}
			});
		}
	}

	/**
	 * Sets the latest consumes offset for a given identifier.
	 *
	 * @param id Identifier
	 * @param offset Offset
	 */
	setLatestOffset(id, offset) {
		this.latestOffsets.set(id, offset);
	}

	/**
	 * Checks if the data stream element is new, i.e., if its offset is higher than the last consumed offset.
	 *
	 * @param id Identifier
	 * @param offset Offset of the data stream element
	 * @returns {boolean} True if the data stream element is new
	 */
	isNewDataStreamElement(id, offset) {
		if (!this.latestOffsets.has(id) || this.latestOffsets.get(id) < offset) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Constructs a String which describes the a JSON error result.
	 *
	 * @param jsonResult JSON result
	 * @returns {string} String which describes the a JSON error result
	 */
	static errorResultToString(jsonResult) {
		var result = "Error " + jsonResult.status + " (" + jsonResult.statusText + "): " + jsonResult.responseJSON.e;
		return result;
	}
}
