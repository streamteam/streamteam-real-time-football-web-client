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
 * Consumes elements of the ballPossessionChangeEvent stream and updates the ball possession highlighting
 */
class BallPossessionChangeEventConsumer extends AbstractAtomicEventConsumer {

	/**
	 * BallPossessionChangeEventConsumer constructor.
	 */
	constructor() {
		super("ballPossessionChangeEvent");
	}

	/**
	 * Logs and visualizes a ball possession event.
	 *
	 * @param dataStreamElementValue Undecoded ballPossessionStatistics stream element
	 */
	logAndShowEvent(dataStreamElementValue) {
		if(typeof ImmutableDataStreamElementContent !== 'undefined' && typeof BallPossessionChangeEventStreamElementPayload !== 'undefined') {
			var ballPossessionChangeEventStreamElement = decodeBase64EncodedImmutableDataStreamElement(dataStreamElementValue);

			var playerId = undefined;
			if(ballPossessionChangeEventStreamElement.objectIdentifiers.length > 0) {
				playerId = ballPossessionChangeEventStreamElement.objectIdentifiers[0];
			}

			if (this.playerInBallPossession != playerId) {
				if($('#visualize-ballPossession-checkbox').prop("checked")) {
					field.highlightBallPossession(this.playerInBallPossession, playerId);
				}
				this.playerInBallPossession = playerId;
			}
		}
	}
}
