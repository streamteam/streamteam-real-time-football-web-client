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
 * Consumes elements of the misplacedPassEvent stream and visualizes the misplaced pass events
 */
class MisplacedPassEventConsumer extends AbstractAtomicEventConsumer {

	/**
	 * MisplacedPassEventConsumer constructor.
	 */
	constructor() {
		super("misplacedPassEvent");
	}

	/**
	 * Logs and visualizes a misplaced pass event.
	 *
	 * @param dataStreamElementValue Undecoded misplacedPassEvent stream element
	 */
	logAndShowEvent(dataStreamElementValue) {
		if(typeof ImmutableDataStreamElementContent !== 'undefined' && typeof MisplacedPassEventStreamElementPayload !== 'undefined') {
			var misplacedPassEventStreamElement = decodeBase64EncodedImmutableDataStreamElement(dataStreamElementValue);

			var shotPlayerId = misplacedPassEventStreamElement.objectIdentifiers[0];
			var shotPlayerX = parseFloat(misplacedPassEventStreamElement.positions[0].x);
			var shotPlayerY = parseFloat(misplacedPassEventStreamElement.positions[0].y);
			var leftFieldX = parseFloat(misplacedPassEventStreamElement.positions[1].x);
			var leftFieldY = parseFloat(misplacedPassEventStreamElement.positions[1].y);
			var length = Math.round(parseFloat(misplacedPassEventStreamElement.payload.length));
			var velocity = Math.round(parseFloat(misplacedPassEventStreamElement.payload.velocity)*3.6);
			var angle = Math.round(parseFloat(misplacedPassEventStreamElement.payload.angle));
			var dirCat = misplacedPassEventStreamElement.payload.direction;

			var logMsg = "Misplaced pass by " + shotPlayerId + " (Length: " + length + "m, Velocity: " + velocity + "km/h, Dir: " + dirCat + " [" + angle + "°])";
			eventNotifier.log(logMsg);

			if($("#showEvents-misplacedPass-checkbox").prop("checked")) {
				var displayText = "Misplaced pass by " + shotPlayerId + "<br> (Length: " + length + "m, Velocity: " + velocity + "km/h, Dir: " + dirCat + " [" + angle + "°])";
				eventNotifier.showText(displayText);
				field.displayPass([{"startX":shotPlayerX, "startY":shotPlayerY, "endX":leftFieldX, "endY":leftFieldY}], Config.MISPLACED_PASS_STROKE_COLOR);
			}
		}
	}
}
