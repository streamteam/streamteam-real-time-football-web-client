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
 * Generic abstract class for consuming elements of an atomic event stream and logging as well as visualizing the event
 */
class AbstractAtomicEventConsumer extends AbstractStreamConsumer {

	/**
	 * AbstractAtomicEventConsumer constructor.
	 *
	 * @param topic Kafka topic
	 */
	constructor(topic) {
		super(topic, queryDict.matchId, 1, Config.ATOMIC_EVENT_CONSUMPTION_INTERVAL_IN_MS);

		//https://ilikekillnerds.com/2015/06/abstract-classes-in-javascript/
		//https://stackoverflow.com/questions/4138012/checks-how-many-arguments-a-function-takes-in-javascript
		if(this.constructor === AbstractAtomicEventConsumer) {
			throw new TypeError("AbstractAtomicEventConsumer cannot be instantiated.");
		}
		if(this.logAndShowEvent === undefined || this.logAndShowEvent.length !== 1) { // Abstract method: logAndShowEvent(dataStreamElementValue)
			throw new TypeError("Classes extending AbstractAtomicEventConsumer have to implement logAndShowEvent(dataStreamElementValue)")
		}
	}

	/**
	 * Handles a successful JSON result received after a consumption call.
	 *
	 * @param jsonResult Successful JSON result received after a consumption call
	 */
	handleSuccess(jsonResult) {
		var dataStreamElement = jsonResult.d[0];

		if (super.isNewDataStreamElement(this.topic, dataStreamElement.o)) {
			super.setLatestOffset(this.topic, dataStreamElement.o);

			this.logAndShowEvent(dataStreamElement.v);
		}
	}
}
