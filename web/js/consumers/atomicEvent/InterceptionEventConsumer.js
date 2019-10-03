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
 * Consumes elements of the interceptionEvent stream and visualizes the interception events
 */
class InterceptionEventConsumer extends AbstractAtomicEventConsumer {

	/**
	 * InterceptionEventConsumer constructor.
	 */
	constructor() {
		super("interceptionEvent");
	}

	/**
	 * Logs and visualizes an interception event.
	 *
	 * @param dataStreamElementValue Undecoded interceptionEvent stream element
	 */
	logAndShowEvent(dataStreamElementValue) {
		if(typeof ImmutableDataStreamElementContent !== 'undefined' && typeof InterceptionEventStreamElementPayload !== 'undefined') {
			var interceptionEventStreamElement = decodeBase64EncodedImmutableDataStreamElement(dataStreamElementValue);

			var shotPlayerId = interceptionEventStreamElement.objectIdentifiers[0];
			var shotPlayerX = parseFloat(interceptionEventStreamElement.positions[0].x);
			var shotPlayerY = parseFloat(interceptionEventStreamElement.positions[0].y);
			var receivePlayerId = interceptionEventStreamElement.objectIdentifiers[1];
			var receivePlayerX = parseFloat(interceptionEventStreamElement.positions[1].x);
			var receivePlayerY = parseFloat(interceptionEventStreamElement.positions[1].y);
			var length = Math.round(parseFloat(interceptionEventStreamElement.payload.length));
			var velocity = Math.round(parseFloat(interceptionEventStreamElement.payload.velocity)*3.6);
			var angle = Math.round(parseFloat(interceptionEventStreamElement.payload.angle));
			var dirCat = interceptionEventStreamElement.payload.direction;

			var logMsg = receivePlayerId + " intercepted pass from " + shotPlayerId + " (Length: " + length + "m, Velocity: " + velocity + "km/h, Dir: " + dirCat + " [" + angle + "°])";
			eventNotifier.log(logMsg);

			if($("#showEvents-interception-checkbox").prop("checked")) {
				var displayText = receivePlayerId + " intercepted pass from " + shotPlayerId + "<br> (Length: " + length + "m, Velocity: " + velocity + "km/h, Dir: " + dirCat + " [" + angle + "°])";
				eventNotifier.showText(displayText);
				field.displayPass([{"startX":shotPlayerX, "startY":shotPlayerY, "endX":receivePlayerX, "endY":receivePlayerY}], Config.INTERCEPTION_STROKE_COLOR);
			}
		}
	}
}
