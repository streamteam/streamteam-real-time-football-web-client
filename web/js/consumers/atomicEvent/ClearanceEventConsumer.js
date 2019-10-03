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
 * Consumes elements of the clearanceEvent stream and visualizes the clearance events
 */
class ClearanceEventConsumer extends AbstractAtomicEventConsumer {

	/**
	 * ClearanceEventConsumer constructor.
	 */
	constructor() {
		super("clearanceEvent");
	}

	/**
	 * Logs and visualizes a clearance event.
	 *
	 * @param dataStreamElementValue Undecoded clearanceEvent stream element
	 */
	logAndShowEvent(dataStreamElementValue) {
		if(typeof ImmutableDataStreamElementContent !== 'undefined' && typeof ClearanceEventStreamElementPayload !== 'undefined') {
			var clearanceEventStreamElement = decodeBase64EncodedImmutableDataStreamElement(dataStreamElementValue);

			var shotPlayerId = clearanceEventStreamElement.objectIdentifiers[0];
			var shotPlayerX = parseFloat(clearanceEventStreamElement.positions[0].x);
			var shotPlayerY = parseFloat(clearanceEventStreamElement.positions[0].y);
			var receivePlayerX = parseFloat(clearanceEventStreamElement.positions[1].x);
			var receivePlayerY = parseFloat(clearanceEventStreamElement.positions[1].y);
			var length = Math.round(parseFloat(clearanceEventStreamElement.payload.length));
			var velocity = Math.round(parseFloat(clearanceEventStreamElement.payload.velocity)*3.6);
			var angle = Math.round(parseFloat(clearanceEventStreamElement.payload.angle));
			var dirCat = clearanceEventStreamElement.payload.direction;

			var msgStart;
			if(clearanceEventStreamElement.objectIdentifiers.length == 1) {
				msgStart = "Clearance of player " + shotPlayerId + " left the field";
			} else {
				var receivePlayerId = clearanceEventStreamElement.objectIdentifiers[1];
				msgStart = "Clearance of player " + shotPlayerId + " received by " + receivePlayerId;
			}

			var logMsg = msgStart + " (Length: " + length + "m, Velocity: " + velocity + "km/h, Dir: " + dirCat + " [" + angle + "°])";
			eventNotifier.log(logMsg);

			if($("#showEvents-clearance-checkbox").prop("checked")) {
				var displayText = msgStart + "<br> (Length: " + length + "m, Velocity: " + velocity + "km/h, Dir: " + dirCat + " [" + angle + "°])";
				eventNotifier.showText(displayText);
				field.displayPass([{"startX":shotPlayerX, "startY":shotPlayerY, "endX":receivePlayerX, "endY":receivePlayerY}], Config.CLEARANCE_STROKE_COLOR);
			}
		}
	}
}
