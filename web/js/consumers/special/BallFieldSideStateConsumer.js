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
 * Consumes elements of the ballFieldSideState stream and updates the ML Test info above the field.
 * TODO: The Ball Field Side Worker is a relatively useless worker that was only introduced to check if StreamTeam can perform Deep Learning based analyses. Remove this file as soon as there is a more meaningful Deep Learning based analysis worker.
 */
class BallFieldSideStateConsumer extends AbstractStreamConsumer {

	/**
	 * BallFieldSideStateConsumer constructor.
	 */
	constructor() {
		super("ballFieldSideState", queryDict.matchId, 1, Config.PRESSING_STATE_CONSUMPTION_INTERVAL_IN_MS);
		this.distance = new Map();
	}

	/**
	 * Handles a successful JSON result received after a consumption call.
	 *
	 * @param jsonResult Successful JSON result received after a consumption call
	 */
	handleSuccess(jsonResult) {
		if (typeof ImmutableDataStreamElementContent !== 'undefined' && typeof BallFieldSideStateStreamElementPayload !== 'undefined') {
			var offset = jsonResult.d[0].o;

			if (super.isNewDataStreamElement("ballFieldSideState", offset)) {
				super.setLatestOffset("ballFieldSideState", offset);

				var ballFieldSideStateStreamElement = decodeBase64EncodedImmutableDataStreamElement(jsonResult.d[0].v);

				var text = "Ball on ";
				if(ballFieldSideStateStreamElement.payload.ballOnLeftSide) {
					text += "left";
				} else {
					text += "right";
				}
				text += " field side";

				$('#above-field-info-left-machineLearningTest').html("ML Test: " + text);
			}
		}
	}
}
