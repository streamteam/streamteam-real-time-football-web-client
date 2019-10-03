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
 * Consumes elements of the fieldObjectState stream and updates the player positions in the visualization
 */
class FieldObjectStateConsumer extends AbstractStreamConsumer {

	/**
	 * FieldObjectState constructor.
	 */
	constructor() {
		super("fieldObjectState", queryDict.matchId, Config.FIELD_OBJECT_STATE_CONSUMPTION_LIMIT, Config.FIELD_OBJECT_STATE_CONSUMPTION_INTERVAL_IN_MS);
	}

	/**
	 * Handles a successful JSON result received after a consumption call.
	 *
	 * @param jsonResult Successful JSON result received after a consumption call
	 */
	handleSuccess(jsonResult) {
		if(typeof ImmutableDataStreamElementContent !== 'undefined' && typeof FieldObjectStateStreamElementPayload !== 'undefined') {
			for (var i = 0; i < jsonResult.d.length; ++i) {
				var offset = jsonResult.d[i].o;
				var fieldObjectStateStreamElement = decodeBase64EncodedImmutableDataStreamElement(jsonResult.d[i].v);

				var playerId = fieldObjectStateStreamElement.objectIdentifiers[0];

				if (super.isNewDataStreamElement(playerId, offset)) {
					super.setLatestOffset(playerId, offset);
					var x = fieldObjectStateStreamElement.positions[0].x;
					var y = fieldObjectStateStreamElement.positions[0].y;
					field.updateObject(playerId, x, y);

					if(fieldObjectStateStreamElement.objectIdentifiers[0] === "BALL") {
						statisticsAndGraphs.addValueToGraph("ballZPosition", fieldObjectStateStreamElement.positions[0].z);
						statisticsAndGraphs.addValueToGraph("ballAbsVelocity", fieldObjectStateStreamElement.payload.vabs);
					}
				}
			}
		}
	}
}
