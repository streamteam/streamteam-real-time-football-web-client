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
 * Generic abstract class for consuming elements of a a statistics stream and updating the statistics visualization
 */
class AbstractStatisticsConsumer extends AbstractStreamConsumer {

	/**
	 * AbstractStatisticsConsumer constructor.
	 *
	 * @param topic Kafka topic
	 */
	constructor(topic) {
		super(topic, queryDict.matchId, Config.STATISTICS_CONSUMPTION_LIMIT, Config.STATISTICS_CONSUMPTION_INTERVAL_IN_MS);

		//https://ilikekillnerds.com/2015/06/abstract-classes-in-javascript/
		//https://stackoverflow.com/questions/4138012/checks-how-many-arguments-a-function-takes-in-javascript
		if(this.constructor === AbstractStatisticsConsumer) {
			throw new TypeError("AbstractStatisticsConsumer cannot be instantiated.");
		}
		if(this.updateStatisticsValues === undefined || this.updateStatisticsValues.length !== 2) { // Abstract method: updateStatisticsValues(id, dataStreamElement)
			throw new TypeError("Classes extending AbstractStatisticsConsumer have to implement updateStatisticsValues(id, dataStreamElement)")
		}
	}

	/**
	 * Handles a successful JSON result received after a consumption call.
	 *
	 * @param jsonResult Successful JSON result received after a consumption call
	 */
	handleSuccess(jsonResult) {
		if (typeof ImmutableDataStreamElementContent !== 'undefined' && typeof BallPossessionStatisticsStreamElementPayload !== 'undefined'
			&& typeof PassStatisticsStreamElementPayload !== 'undefined' && typeof ShotStatisticsStreamElementPayload !== 'undefined'
			&& typeof PassSequenceStatisticsStreamElementPayload !== 'undefined' && typeof DistanceStatisticsStreamElementPayload !== 'undefined'
			&& typeof DribblingStatisticsStreamElementPayload !== 'undefined' && typeof SpeedLevelStatisticsStreamElementPayload !== 'undefined'
			&& typeof SetPlayStatisticsStreamElementPayload !== 'undefined') {
			for(var i = jsonResult.d.length-1; i >= 0; --i) { // reverse order --> oldest first
				var offset = jsonResult.d[i].o;

				if (super.isNewDataStreamElement(this.topic, offset)) {
					super.setLatestOffset(this.topic, offset);

					var dataStreamElement = decodeBase64EncodedImmutableDataStreamElement(jsonResult.d[i].v);

					var id;
					if(dataStreamElement.objectIdentifiers.length > 0) {
						id = dataStreamElement.objectIdentifiers[0]; // player statistics stream element
					} else {
						id = dataStreamElement.groupIdentifiers[0]; // team statistics stream element
					}

					this.updateStatisticsValues(id, dataStreamElement);
				}
			}
		}
	}
}
