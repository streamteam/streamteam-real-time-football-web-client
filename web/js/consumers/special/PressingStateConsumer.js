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
 * Consumes elements of the pressingState stream and updates the pressing index above the field and in the pressing index graph.
 */
class PressingStateConsumer extends AbstractStreamConsumer {

	/**
	 * PressingStateConsumer constructor.
	 */
	constructor() {
		super("pressingState", queryDict.matchId, 1, Config.PRESSING_STATE_CONSUMPTION_INTERVAL_IN_MS);
		this.distance = new Map();
	}

	/**
	 * Handles a successful JSON result received after a consumption call.
	 *
	 * @param jsonResult Successful JSON result received after a consumption call
	 */
	handleSuccess(jsonResult) {
		if (typeof ImmutableDataStreamElementContent !== 'undefined' && typeof PressingStateStreamElementPayload !== 'undefined') {
			var offset = jsonResult.d[0].o;

			if (super.isNewDataStreamElement("pressingState", offset)) {
				super.setLatestOffset("pressingState", offset);

				var pressingStateStreamElement = decodeBase64EncodedImmutableDataStreamElement(jsonResult.d[0].v);

				var pressingIndex = parseFloat(pressingStateStreamElement.payload.pressingIndex);

				$('#above-field-info-right-pressingIndex').html("Pressing Index: " + pressingIndex.toFixed(2));

				statisticsAndGraphs.addValueToGraph("pressingIndex", pressingIndex);
			}
		}
	}
}
