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
 * Consumes elements of the successfulPassEvent stream and visualizes the successful pass events
 */
class SuccessfulPassEventConsumer extends AbstractAtomicEventConsumer {

	/**
	 * SuccessfulPassEventConsumer constructor.
	 */
	constructor() {
		super("successfulPassEvent");
	}

	/**
	 * Logs and visualizes a successful pass event.
	 *
	 * @param dataStreamElementValue Undecoded successfulPassEvent stream element
	 */
	logAndShowEvent(dataStreamElementValue) {
		if(typeof ImmutableDataStreamElementContent !== 'undefined' && typeof SuccessfulPassEventStreamElementPayload !== 'undefined') {
			var successfulPassEventStreamElement = decodeBase64EncodedImmutableDataStreamElement(dataStreamElementValue);

			var shotPlayerId = successfulPassEventStreamElement.objectIdentifiers[0];
			var shotPlayerX = parseFloat(successfulPassEventStreamElement.positions[0].x);
			var shotPlayerY = parseFloat(successfulPassEventStreamElement.positions[0].y);
			var receivePlayerId = successfulPassEventStreamElement.objectIdentifiers[1];
			var receivePlayerX = parseFloat(successfulPassEventStreamElement.positions[1].x);
			var receivePlayerY = parseFloat(successfulPassEventStreamElement.positions[1].y);
			var length = Math.round(parseFloat(successfulPassEventStreamElement.payload.length));
			var velocity = Math.round(parseFloat(successfulPassEventStreamElement.payload.velocity)*3.6);
			var angle = Math.round(parseFloat(successfulPassEventStreamElement.payload.angle));
			var dirCat = successfulPassEventStreamElement.payload.direction;
			var packing = parseInt(successfulPassEventStreamElement.payload.packing);

			var logMsg = "Successful pass from " + shotPlayerId + " to " + receivePlayerId + " (Length: " + length + "m, Velocity: " + velocity + "km/h, Dir: " + dirCat + " [" + angle + "°], Packing: " + packing + ")";
			eventNotifier.log(logMsg);

			if($("#showEvents-successfulPass-checkbox").prop("checked")) {
				var displayText = "Successful pass from " + shotPlayerId + " to " + receivePlayerId + "<br> (Length: " + length + "m, Velocity: " + velocity + "km/h, Dir: " + dirCat + " [" + angle + "°], Packing: " + packing + ")";
				eventNotifier.showText(displayText);
				field.displayPass([{"startX":shotPlayerX, "startY":shotPlayerY, "endX":receivePlayerX, "endY":receivePlayerY}], Config.SUCCESSFUL_PASS_STROKE_COLOR);
			}
		}
	}
}
