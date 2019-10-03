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

/** Consumes the offsideLineState data stream and visualizes the offside line and players in offside position **/

/**
 * Consumes elements of the offsideLineState stream and visualizes the offside line and players in offside position
 */
class OffsideLineStateConsumer extends AbstractStreamConsumer {

	/**
	 * OffsideLineStateConsumer constructor.
	 */
	constructor() {
		super("offsideLineState", queryDict.matchId, 1, Config.OFFSIDE_LINE_STATE_CONSUMPTION_INTERVAL_IN_MS);
		this.oldPlayersInOffsidePosition = [];
		this.xIsNull = true;
	}

	/**
	 * Handles a successful JSON result received after a consumption call.
	 *
	 * @param jsonResult Successful JSON result received after a consumption call
	 */
	handleSuccess(jsonResult) {
		if (typeof ImmutableDataStreamElementContent !== 'undefined' && typeof OffsideLineStateStreamElementPayload !== 'undefined') {
			var offset = jsonResult.d[0].o;

			if (super.isNewDataStreamElement("offsideLineState", offset)) {
				super.setLatestOffset("offsideLineState", offset);

				if($("#visualize-virtualOffside-checkbox").prop("checked")) {
					var offsideLineStateStreamElement = decodeBase64EncodedImmutableDataStreamElement(jsonResult.d[0].v);

					var playersInOffsidePosition = [];

					if (offsideLineStateStreamElement.objectIdentifiers.length === 0 && !this.xIsNull) {
						this.xIsNull = true;
						field.updateOffsideVisualizationVisibility();
					} else {
						if (this.xIsNull) {
							this.xIsNull = false;
							field.updateOffsideVisualizationVisibility();
						}

						var offsideLineX = offsideLineStateStreamElement.positions[1].x;
						field.updateOffsideLine(offsideLineX);

						for (var i = 1; i < offsideLineStateStreamElement.objectIdentifiers.length; ++i) {
							playersInOffsidePosition.push(offsideLineStateStreamElement.objectIdentifiers[i]);
						}
					}

					field.highlightOffsidePlayers(this.oldPlayersInOffsidePosition, playersInOffsidePosition);
					this.oldPlayersInOffsidePosition = playersInOffsidePosition;
				}
			}
		}
	}
}
